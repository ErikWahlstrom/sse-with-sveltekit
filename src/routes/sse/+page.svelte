<script lang="ts">
	import ndjsonStream from 'can-ndjson-stream';
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	let statusData = undefined as undefined | { message: string; status: string; count?: number };

	const firstCap = (title: string) => {
		return title.charAt(0).toUpperCase() + title.slice(1);
	};

	const startLongRunningProcess = async (target: EventTarget | null) => {
		const formData = new FormData(target as HTMLFormElement);
		const res = await fetch('?/sse', {
			method: 'POST',
			body: formData
		});
		if (!res.ok) {
			const data = await res.json();
			throw new Error(data.errorMessage);
		}

		const theNdJsonStream = ndjsonStream(res.body);
		const reader = theNdJsonStream.getReader();

		statusData = undefined;

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			if (value) {
				const theJson = value;
				console.log('theJson', theJson);
				statusData = theJson;
			}
		}
		console.log('loop is done');
	};
</script>

<h1>{firstCap(data.post.title)}</h1>

<!-- make an overlay of the form when fetching is true -->
{#if statusData && statusData.status !== 'done'}
	<div class="fetching">
		<div>
			<p>
				Form message {statusData.message}
			</p>
			<p>
				Status: {statusData.status}
			</p>
			{#if statusData.count}
				<p>
					Count is: {statusData.count}
				</p>
			{/if}
		</div>
	</div>
{/if}
<form
	method="POST"
	on:submit={async (e) => {
		e.preventDefault();
		await startLongRunningProcess(e.target);
	}}
>
	<label>
		First parameter
		<input name="first" type="text" />
	</label>
	<label>
		Second parameter
		<input name="second" type="text" />
	</label>
	<button>Run long running process</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		width: 50%;
		margin: 0 auto;
	}
	.fetching {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.fetching div {
		background: white;
		padding: 1rem;
		border-radius: 5px;
	}
</style>
