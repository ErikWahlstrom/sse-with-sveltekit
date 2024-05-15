<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;
	let fetching = false;

	$: if (form?.body?.message) {
		fetching = false;
	}

	function firstCap(title: string) {
		return title.charAt(0).toUpperCase() + title.slice(1);
	}
</script>

<h1>{firstCap(data.post.title)}</h1>

{#if form?.body.message}
	<p>Form message {form.body.message}</p>
{/if}

<!-- make an overlay of the form when fetching is true -->
{#if fetching}
	<div class="fetching">
		<div>
			<h2>Fetching...</h2>
		</div>
	</div>
{/if}
<form method="POST" action="?/firstAction">
	<label>
		First parameter
		<input name="first" type="text" />
	</label>
	<label>
		Second parameter
		<input name="second" type="text" />
	</label>
	<button
		on:click={() => {
			fetching = true;
		}}>Run long running process</button
	>
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
