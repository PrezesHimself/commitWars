<script>
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import Container from './components/Container.svelte';
</script>
<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

</style>

<div class="app">
	<Header/>
	<Container/>
	<Footer/>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js"></script>
</div>