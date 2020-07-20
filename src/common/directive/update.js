let events = {
    update: null
  }
  
  
  export default {
    name: "update",
    option: {
      bind (el, binding) {
        events.update = new Event('update')
        el.addEventListener('update', () => {}, false)
      },
      update (el, binding) {
        el.dispatchEvent(events.update)
      }
    }
  };
  