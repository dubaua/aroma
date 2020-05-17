import Immerser from 'immerser';

const immerserInstance = new Immerser({
  solidClassnameArray: [
    {
      'left-top': 'color-text',
      'right-bottom': 'color-text--contrast',
      'left-bottom': 'color-text--contrast',
    },
    {
      'left-top': 'color-text--contrast',
      pager: 'pager--contrast',
      'left-bottom': 'color-text--contrast',
      'right-bottom': 'color-text',
    },
    {
      'left-top': 'color-text',
      'right-bottom': 'color-text',
      'left-bottom': 'color-text',
    },
    {
      'left-top': 'color-text--contrast',
      pager: 'pager--contrast',
      'left-bottom': 'color-text--contrast',
      'right-bottom': 'color-text',
    },
    {
      'left-top': 'color-text',
      'right-bottom': 'color-text',
      'left-bottom': 'color-text',
    },
    {
      'left-top': 'color-text',
      'right-bottom': 'color-text',
      'left-bottom': 'color-text',
    },
    {
      'left-top': 'color-text',
      'right-bottom': 'color-text',
      'left-bottom': 'color-text',
    },
  ],
  hasToUpdateHash: true,
  fromViewportWidth: 1024,
  onInit(immerser) {
    // callback on init
  },
  onBind(immerser) {
    // callback on bind
  },
  onUnbind(immerser) {
    // callback on unbind
  },
  onDestroy(immerser) {
    // callback on destroy
  },
  onActiveLayerChange(activeIndex, immerser) {
    // callback on active layer change
  },
});

// установка иммерсера неправильная
// hasToAdjust false не помогает
