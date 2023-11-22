import React, { ReactNode, createContext, useEffect, useState } from 'react';

import { sketchApi } from '../../api';
import { VirtualMachineBlockNode } from '../blocks/VirtualMachineBlockNode.tsx';
import { useChannelNavigationContext } from './ChannelNavigationProvider.tsx';
import { useErrorHandler } from './ErrorProvider.tsx';

type Block = typeof VirtualMachineBlockNode;

export type SketchBlock = {
  sketchId: string;
  blockList: Block[];
};

export type SketchBlockContextValue = {
  sketchBlock: SketchBlock;
  setSketchBlock: (sketchBlock: SketchBlock) => void;
};

const SketchBlockContext = createContext<SketchBlockContextValue | undefined>(
  undefined,
);

export function SketchProvider({
  children,
  sketchId,
}: {
  children: ReactNode;
  sketchId: string;
}) {
  const [sketchBlock, setSketchBlock] = useState<SketchBlock | undefined>();
  const { currentChannel: channelId } = useChannelNavigationContext();
  const errorContext = useErrorHandler();

  useEffect(() => {
    (async () => {
      try {
        const response = await sketchApi.getSketchAsync(
          channelId.channelId,
          sketchId,
        );
        setSketchBlock(response.data.blockSketch as SketchBlock);
      } catch (e) {
        errorContext.showError(e);
      }
    })();
  }, [sketchId, channelId, errorContext]);

  if (!sketchBlock) return <div>로딩중</div>;
  return (
    <SketchBlockContext.Provider
      value={{
        sketchBlock,
        setSketchBlock,
      }}
    >
      {children}
    </SketchBlockContext.Provider>
  );
}
