import React, { useState, useEffect } from 'react';
import { Stroke, Fill, Style as OlStyle, Circle } from 'ol/style';
import { Style, PreviewMap } from 'geostyler';
import OlParser from 'geostyler-openlayers-parser';
import WfsParser from 'geostyler-wfs-parser';
import X2JS from 'x2js-fork'
import './App.css';

import 'antd/dist/antd.css';
import 'antd/lib/menu/style';
import { addEquivalentProjections } from 'ol/proj';
import SldParser from 'geostyler-sld-parser';

const olParser = new OlParser();
const sldParser = new SldParser();
const wfsParser = new WfsParser();
const x2js = new X2JS();

function App() {
  
  const wfsParams = {
    url: 'https://ows-demo.terrestris.de/geoserver/terrestris/ows',
    version: '1.1.0',
    typeName: 'terrestris:bundeslaender',
    srsName: 'EPSG:4326'
  };


  const olStyle = new OlStyle({
      stroke: new Stroke({
          color: 'rgba(255, 255, 255, 1.0)',
          width: 1
      }),
      fill: new Fill({
          color: 'rgba(0, 0, 0, 1)'
      }),
      image: new Circle({
          fill: new Fill({
              color: 'rgba(255, 0, 0, 1.0)'
          }),
          radius: 5
      })
  });

  const [style, setStyle] = useState();
  const [data, setData] = useState();
  const [sld, setSld] = useState('');
 

  useEffect(() => {
    olParser.readStyle(olStyle)
      .then((geostylerStyle) => {
        setStyle(geostylerStyle.output);
        return sldParser.writeStyle(geostylerStyle.output);
      }).then((sldStyle) => {
        setSld(sldStyle.output);
      })
    wfsParser.readData(wfsParams)
      .then((gsData) => {
        setData(gsData);
      });
  }, []);
  return (
    <div>
      <div className="codeEditor">
      <h2>Graphical Editor</h2>
      <Style
          style={style}
          data={data}
          //able to use the tabular layout of the Style component
          compact={true}
          onStyleChange={(newStyle) => 
            {
              setStyle(newStyle);
              (sldParser.writeStyle(newStyle))
              .then((sldStyle) => {
                setSld(sldStyle.output);
              });
            }
          }
        />
      </div>
      <div className="mapPreview">
        <h2>Preview Map</h2>
        {
          style && (
            <PreviewMap
              style={style}
              data={data}
            />
          )
        } 
      </div>
      <div className="codePreview">
           <article>
                    <h2>Code Preview</h2>
                    <p> Format: SLD style parser</p>

                    <div id='xml'>
                      <pre>{sld}</pre>
                    </div>
                    <button className='btn'> Export to XML </button>
           </article>
      </div>
 
    </div>
  );
}
export default App;
