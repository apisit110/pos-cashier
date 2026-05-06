import 'styled-components';
import { Theme } from './presentation/styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
