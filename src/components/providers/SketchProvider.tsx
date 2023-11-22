import React, { ReactNode, createContext, useEffect, useState } from 'react';

import { sketchApi } from '../../api';
import { VirtualMachineBlockNodeProps } from '../blocks/VirtualMachineBlockNode.tsx';
import { useChannelNavigationContext } from './ChannelNavigationProvider.tsx';
import { useErrorHandler } from './ErrorProvider.tsx';

type Block = VirtualMachineBlockNodeProps & {
  id: string;
  blockType: string;
  x: number;
  y: number;
};

type SketchBlock = {
  sketchId: string;
  blockList: Block[];
};

type SketchBlockContextValue = {
  sketchBlock: SketchBlock;
  setSketchBlock: (sketchBlock: SketchBlock) => void;
};

type SketchProjection = {
  sketchId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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
  const [sketchProjection, setSketchProjection] = useState<
    SketchProjection | undefined
  >();
  const [sketchBlock, setSketchBlock] = useState<SketchBlock | undefined>(
    undefined,
  );
  const { currentChannel: channelId } = useChannelNavigationContext();
  const { showError } = useErrorHandler();

  useEffect(() => {
    console.log('SketchBlockContext SketchId Changed');
    (async () => {
      try {
        const response = await sketchApi.getSketchAsync(
          channelId.channelId,
          sketchId,
        );
        setSketchBlock(response.data.blockSketch as SketchBlock);
        setSketchProjection({
          sketchId: response.data.sketchId,
          name: response.data.name,
          description: response.data.description,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        });
      } catch (e) {
        showError(e);
      }
    })();
  }, [sketchId, channelId]);

  useEffect(() => {
    if (!sketchBlock) return;
    console.log('SketchBlockContext SketchBlock Changed', sketchBlock);
    (async () => {
      try {
        await sketchApi.updateSketchAsync(channelId.channelId, sketchId, {
          name: sketchProjection?.name ?? '',
          description: sketchProjection?.description ?? '',
          blockData: {
            ...sketchBlock,
            sketchId: sketchProjection?.sketchId ?? '',
          },
        });
      } catch (e) {
        showError(e);
      }
    })();
  }, [sketchBlock]);

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

export function useSketchBlockContext() {
  const context = React.useContext(SketchBlockContext);
  if (context === undefined) {
    throw new Error(
      'useSketchBlockContext must be used within a SketchBlockContext',
    );
  }
  return context;
}
