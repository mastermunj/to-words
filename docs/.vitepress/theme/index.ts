import DefaultTheme from 'vitepress/theme';
import NumberDemo from '../components/NumberDemo.vue';
import type { Theme } from 'vitepress';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('NumberDemo', NumberDemo);
  },
} satisfies Theme;
