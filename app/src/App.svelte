<script>
    import Header from './components/Header.svelte';
    import Footer from './components/Footer.svelte';
    import Container from './components/Container.svelte';
    import {Router, Link, Route} from "svelte-routing";
    import RouteIndex from "./router/RouteIndex.svelte";
    import RouteReleases from "./router/RouteReleases.svelte";

    export let url = "";
</script>
<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

</style>

<div class="app">
    <Router url="{url}">
        <nav>
            <Link to="/">Home</Link>
            <Link to="releases">Releases</Link>
        </nav>

        <Header/>
            <div>
                <Route path="releases" component="{RouteReleases}" />
                <Route path="/" component="{RouteReleases}" />
            </div>
        <Footer/>
    </Router>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js"></script>
</div>