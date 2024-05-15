<script lang="ts">
	import type { Readable, readable } from 'svelte/store';
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	import { page } from '$app/stores';

	const firstCap = (title: string) => {
		return title.charAt(0).toUpperCase() + title.slice(1);
	};

	import { source } from 'sveltekit-sse';

	let json = undefined as undefined | Readable<any>;

	$: console.log({ $json });

	const startLongRunningProcess = async (target: EventTarget | null) => {
		const formData = new FormData(target as HTMLFormElement);
		const connection = source($page.url.pathname + '/sse-route', {
			options: { body: formData }
		});

		console.log('connection', connection);

		json = connection.select('sse-message').json(function or({ error, raw, previous }) {
			console.log(`Could not parse "${raw}" as json.`, error);
			return previous; // This will be the new value of the store
		});
	};
</script>

<h1>{firstCap(data.post.title)}</h1>

<!-- make an overlay of the form when fetching is true -->
{#if $json && $json.status !== 'done'}
	<div class="fetching">
		<div>
			<p>
				Form message {$json.message}
			</p>
			<p>
				Status: {$json.status}
			</p>
			{#if $json.count}
				<p>
					Count is: {$json.count}
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
