import { AxiosHeaders } from 'axios';
import { useEffect, useState } from 'react';

import { sketchApi } from '../api';
import { SketchResponse } from '../libs/core-api/api';
import { SketchListElement } from './SketchListElement';

export function SketchList() {
  const [selectedChannelId] = useState(
    localStorage.getItem('selectedChannelId') || '',
  );
  const [sketchList, setSketchList] = useState<SketchResponse[]>([]);

  useEffect(() => {
    (async () => {
      const accessToken: string = localStorage.getItem('accessToken') || '';
      const headers = new AxiosHeaders();
      headers.setAuthorization(`Bearer ${accessToken}`);

      const response = await sketchApi.listSketchesInChannelAsync(
        selectedChannelId,
        { headers },
      );
      setSketchList(response.data);
    })();
  }, [selectedChannelId]);

  return (
    <div
      className="sketchList"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {sketchList.map((sketch, index) => (
        <div key={index}>
          <SketchListElement
            sketchId={sketch.sketchId}
            name={sketch.name}
            description={sketch.description}
            channelId={sketch.channelId}
            blockSketch={undefined}
          />
        </div>
      ))}
    </div>
  );
}
