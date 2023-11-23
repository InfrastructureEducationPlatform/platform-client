import { debounce } from 'lodash';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { sketchApi } from '../../api';
import { VirtualMachineBlockNodeProps } from '../blocks/VirtualMachineBlockNode.tsx';
import { useChannelNavigationContext } from './ChannelNavigationProvider.tsx';
import { useErrorHandler } from './ErrorProvider.tsx';

export type Block = VirtualMachineBlockNodeProps & {
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

  // Callback for saving sketch data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callbackTest = useCallback(
    debounce(
      async (
        channelId: string,
        sketchId: string,
        sketchInput: SketchBlock,
        sketchProjectionInput: SketchProjection,
      ) => {
        try {
          await sketchApi.updateSketchAsync(channelId, sketchId, {
            name: sketchProjectionInput?.name ?? '',
            description: sketchProjectionInput?.description ?? '',
            blockData: {
              ...sketchInput,
              sketchId: sketchProjectionInput?.sketchId ?? '',
            },
          });
        } catch (e) {
          showError(e);
        }
      },
      500,
    ),
    [],
  );

  useEffect(() => {
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
    if (sketchBlock !== undefined && sketchProjection !== undefined) {
      callbackTest(
        channelId.channelId,
        sketchId,
        sketchBlock,
        sketchProjection,
      );
    }
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
