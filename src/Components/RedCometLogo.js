import React from 'react';
import { Center, Text } from 'native-base';
import { Dimensions } from 'react-native'
import { SvgXml } from 'react-native-svg';

const xml = `
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="117px" height="20px" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"
viewBox="0 0 18.38 3.15"
 xmlns:xlink="http://www.w3.org/1999/xlink"
 xmlns:xodm="http://www.corel.com/coreldraw/odm/2003">
 <defs>
   <linearGradient id="id0" gradientUnits="userSpaceOnUse" x1="0.6" y1="0.36" x2="2.73" y2="2.79">
    <stop offset="0" stop-opacity="1" stop-color="#F6D22B"/>
    <stop offset="0.160784" stop-opacity="1" stop-color="#F28231"/>
    <stop offset="1" stop-opacity="1" stop-color="#ED3237"/>
   </linearGradient>
 </defs>
 <g id="Camada_x0020_1">
  <metadata id="CorelCorpID_0Corel-Layer"/>
  <path fill="url(#id0)" d="M0.85 0.05c0.03,0.05 0,0.12 -0.06,0.12 -0.07,0 -0.09,-0.11 -0.12,-0.17 0.07,0.01 0.15,0 0.18,0.05zm-0.05 0.36c0.07,0.11 0,0.25 -0.13,0.25 -0.14,0 -0.17,-0.23 -0.23,-0.34 0.13,0.03 0.3,0 0.36,0.09zm-0.62 0.09c0.04,0.06 0,0.13 -0.06,0.13 -0.07,0 -0.09,-0.11 -0.12,-0.17 0.07,0.01 0.15,0 0.18,0.04zm0.22 0.38c0.65,0.3 0.41,1.25 0.8,1.79 0.41,0.54 1.23,0.69 1.79,0.13 0.61,-0.61 0.35,-1.62 -0.38,-1.92 -0.73,-0.31 -1.01,0 -1.62,-0.65 0.05,0.64 0.46,0.97 1.1,1.03 0.48,0.05 0.68,0.3 0.76,0.55 0.17,0.5 -0.41,1.11 -1.02,0.79 -0.31,-0.16 -0.34,-0.41 -0.38,-0.69 -0.07,-0.46 -0.27,-1.11 -1.05,-1.03z"/>
  <path fill="#ED3237" fill-rule="nonzero" d="M10.82 2.53l-0.29 0 -0.2 -0.19 0 -1.17 0.2 -0.19 1.06 0 0.2 0.19 0 0.29 -0.49 0.2 0 -0.29 -0.48 0 0 1.16zm-5.91 0.6c-0.18,-0.1 -0.3,-0.22 -0.38,-0.33 -0.06,-0.09 -0.1,-0.16 -0.1,-0.22l-0.01 -0.04 0 -1.56 1.18 0 0.29 0.29 0 0.59 -0.15 0.15 0.15 0.14 0 0.39 -0.49 0 0 -0.39 -0.49 0 0 0.98zm0.39 -1.37l0.1 -0.1 0 -0.19c-0.03,-0.03 -0.07,-0.07 -0.1,-0.1l-0.39 0 0 0.39 0.39 0zm2.1 0.78l-0.69 0 0 -0.39 0.4 0 0 -0.09 0.48 0.09 0 0.2 -0.19 0.19zm-0.78 0l-0.49 0 0 -1.56 1.27 0 0.19 0.19 0 0.1 -0.48 0.2 0 -0.1 -0.49 0 0 0.2 0.39 0 0 0.39 -0.39 0 0 0.58zm2.45 0l-0.69 0 0 -0.39 0.39 0 0 -0.78 -0.48 0 0 1.17 -0.49 0 0 -1.56 1.27 0 0.19 0.19 0 1.18 -0.19 0.19zm2.52 -0.01l-0.67 0 0 -0.39 0.38 0 0 -0.29 0.49 0.19 0 0.3 -0.2 0.19zm1.65 0l-1.06 0 -0.2 -0.19 0 -1.17 0.2 -0.19 1.06 0 0.2 0.19 0 1.17 -0.2 0.19zm-0.29 -0.39l0 -0.78 -0.48 0 0 0.78 0.48 0zm1.75 0.78l0 -1.17 -0.29 0.29 -0.29 -0.29 0 1.17 -0.48 -0.39 0 -1.55 0.48 -0.39 0 0.39 0.29 0.36 0.29 -0.36 0 -0.39 0.49 0.39 0 1.55 -0.49 0.39zm2.02 -0.39l-0.68 0 0 -0.39 0.39 0 0 -0.1 0.48 0.1 0 0.2 -0.19 0.19zm-0.77 0l-0.49 0 0 -1.55 1.26 0 0.19 0.19 0 0.1 -0.48 0.19 0 -0.09 -0.48 0 0 0.19 0.38 0 0 0.39 -0.38 0 0 0.58zm1.94 0.58c-0.17,-0.1 -0.3,-0.21 -0.38,-0.33 -0.06,-0.08 -0.09,-0.16 -0.1,-0.22l0 -0.03 0 -1.07 -0.2 0 -0.29 -0.48 1.46 0 -0.29 0.48 -0.2 0 0 1.65z"/>
 </g>
</svg>`

const RCLogo = () => <SvgXml width="100" height="20" xml={xml} />;


function RedCometLogo() {
  return (<Center position={'absolute'} top={Dimensions.get('window').height - 20}>
    <Text fontSize={'xs'} lineHeight={'15'} italic>Powered By</Text>
    <RCLogo />
  </Center>)
}

export default RedCometLogo