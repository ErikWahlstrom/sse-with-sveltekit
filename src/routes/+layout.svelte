<!-- put a nice navigator on top with navigation to the sse route -->
<div class="container">
	<nav>
		<a href="/">Home</a>
		<a href="/without-sse">No SSE</a>
		<a href="/sse">SSE</a>
		<a href="/sse-with-sveltekit-sse">SSE (Sveltekit SSE)</a>
	</nav>

	<slot class="content"></slot>
</div>

<!-- Style the nav to be sitting at the top of the page -->
<style>
	nav {
		height: 20%;
		width: 100%;
		background-color: #333;
		color: white;
		font-size: large;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		place-items: center;
	}
	nav a {
		color: white;
		text-decoration: none;
	}

	.container {
		height: 100vh;
	}

	.content {
		height: 80%;
	}
</style>
