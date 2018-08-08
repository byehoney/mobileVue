import TopbarComponent from './topbar';

const Topbar = {
    install() {
        Vue.component(TopbarComponent.name, TopbarComponent)
    }
}

export default Topbar;