const selection = figma.currentPage.selection;

figma.showUI(__html__, { width: 320, height: 320 });

if (selection) {
  for (const node of selection as any) {
    figma.ui.postMessage({
      objectWidth: node.width,
      objectHeight: node.height,
      percentage: 100,
    });

    figma.ui.onmessage = async (msg) => {
      if (msg.type === "resize-by-percentage") {
        node.rescale(msg.percentageRatio);
        figma.notify(`⚡️ Hurray! Your selection has been resized by the percentage.`);
      } else if (msg.type === "resize-by-width") {
        node.rescale(msg.widthRatio);
        figma.notify(`⚡️ Hurray! Your selection has been resized by the width.`);
      } else if (msg.type === "resize-by-height") {
        node.rescale(msg.heightRatio);
        figma.notify(`⚡️ Hurray! Your selection has been resized by the height.`);
      } else {
        figma.closePlugin();
      }
    };
  }

  figma.on("selectionchange", () => {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      figma.notify(`${selection[0].name} selected`, { timeout: 100 });
      for (const node of selection as any) {
        figma.ui.postMessage({
          objectWidth: node.width,
          objectHeight: node.height,
          percentage: 100,
        });

        figma.ui.onmessage = async (msg) => {
          if (msg.type === "resize-by-percentage") {
            node.rescale(msg.percentageRatio);
            figma.notify(`⚡️ Hurray! Your selection has been resized by the percentage.`);
          } else if (msg.type === "resize-by-width") {
            node.rescale(msg.widthRatio);
            figma.notify(`⚡️ Hurray! Your selection has been resized by the width.`);
          } else if (msg.type === "resize-by-height") {
            node.rescale(msg.heightRatio);
            figma.notify(`⚡️ Hurray! Your selection has been resized by the height.`);
          } else {
            figma.closePlugin();
          }
        };
      }
    } else {
      figma.notify(`😭 Sorry! You aren't actively selecting a layer.`, { timeout: 100 });

      figma.ui.postMessage({
        objectWidth: undefined,
        objectHeight: undefined,
        percentage: undefined,
      });
    }
  });
}

figma.notify(`Please select a layer to get started.`, { timeout: 2000 });
