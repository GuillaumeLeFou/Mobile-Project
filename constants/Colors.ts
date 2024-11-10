/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#5E83DB';
const tintColorDark = '#5E83DB';
const darkBlue = '#5E83DB';
const textColor = '#ffffff';

export const Colors = {
  light: {
    text: '#11181C',
    textButton: '#fff',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ffffff',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  customeStyle: {
    text: textColor,
    backgroud: '#444444',
    darkBlue: darkBlue,
    placeholder: '#b4b4b4',
  },


};
