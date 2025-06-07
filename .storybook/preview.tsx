import React from 'react';
import type { Preview } from "@storybook/react-webpack5";
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <StyleSheetManager enableVendorPrefixes shouldForwardProp={isPropValid}>
        <Story />
      </StyleSheetManager>
    ),
  ],
};

export default preview; 