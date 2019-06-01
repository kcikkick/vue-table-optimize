<template>
  <div id='app'>
    <nav class='left'>
      <h1>Body Render</h1>
      <ul @click='clickMenu'>
        <li><a class='menu-link' :class='{active: commonLinkActive}' id='commonMenu' href='#/'>Common Body</a></li>
        <li><a class='menu-link' :class='{active: rafLinkActive}' href='#/requestAnimationFrame' id='requestAnimationFrameMenu'>RequestAnimationFrame</a></li>
        <li><a class='menu-link' :class='{active: virtualLinkActive}' href='#/virtualScroll' id='virtualMenu'>Virtual Scroll</a></li>
      </ul>
    </nav>
    <article class='right'>
      <router-view/>
    </article>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data () {
      let [commonLinkActive, rafLinkActive, virtualLinkActive] = this.initLinkStatus();
      return {
        commonLinkActive: commonLinkActive,
        rafLinkActive: rafLinkActive,
        virtualLinkActive: virtualLinkActive,
      };
    },
    methods: {
      initLinkStatus: function () {
        if (this.$route.path.indexOf('requestAnimationFrame') > -1) {
          return [
            false,
            true,
            false,
          ];
        }
        if (this.$route.path.indexOf('virtualScroll') > -1) {
          return [
            false,
            false,
            true,
          ];
        }
        return [
          true,
          false,
          false,
        ];
      },
      clickMenu: function (e) {
        if (e.target.id) {
          this.commonLinkActive = false;
          this.rafLinkActive = false;
          this.virtualLinkActive = false;
          if (e.target.id === 'commonMenu') {
            this.commonLinkActive = true;
          }
          if (e.target.id === 'requestAnimationFrameMenu') {
            this.rafLinkActive = true;
          }
          if (e.target.id === 'virtualMenu') {
            this.virtualLinkActive = true;
          }
        }
      },
    },
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    display: flex;
  }

  .left {
    width: 300px;
  }

  .left ul {
    padding-left: 0;
    margin: 0;
  }

  .left ul li {
    text-align: left;
    padding: 8px;
    float: right;
  }

  .menu-link {
    font-size: 14px;
    padding: 4px 20px;
    text-decoration: none;
    color: #767676;
  }

  .menu-link.active {
    color: #297EA3;
    font-weight: bold;
    border-right: 2px solid #297EA3;
  }

  .menu-link:hover {
    color: #297EA3;
    border-right: 1px solid #297EA3;
  }

  .right {
    flex: 1 1 auto;
  }

</style>
