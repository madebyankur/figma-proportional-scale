// define selection
const selection = figma.currentPage.selection;

// show ui in figma
figma.showUI(__html__, { width: 320, height: 320 });

// first check if there is an active selection
if (selection) {
  // // traverse selection to each node
  for (const node of selection as any) {
    // send selection parameters to UI layer
    figma.ui.postMessage({
      objectWidth: node.width,
      objectHeight: node.height,
      percentage: 100,
    });

    // receive user input from UI layer
    figma.ui.onmessage = async (msg) => {
      if (msg.type === "resize-by-percentage") {
        // scale each node based on percentage input
        selection.forEach((item) => item.rescale(msg.percentageRatio));
        // alert user on success
        figma.notify(`⚡️ Hurray! Your selection has been resized by the percentage.`);
      } else if (msg.type === "resize-by-width") {
        // scale each node based on width input
        selection.forEach((item) => item.rescale(msg.widthRatio));
        // alert user on success
        figma.notify(`⚡️ Hurray! Your selection has been resized by the width.`);
      } else if (msg.type === "resize-by-height") {
        // scale each node based on height input
        selection.forEach((item) => item.rescale(msg.heightRatio));
        // alert user on success
        figma.notify(`⚡️ Hurray! Your selection has been resized by the height.`);
      }
    };

    if (selection.length > 1) {
      figma.ui.onmessage = async (msg) => {
        if (msg.type === "resize-by-percentage") {
          // scale each node based on percentage input
          selection.forEach((item) => item.rescale(msg.percentageRatio));
          // alert user on success
          figma.notify(`⚡️ Hurray! Your selection has been resized by the percentage.`);
        } else if (msg.type === "resize-by-width") {
          // scale each node based on width input
          selection.forEach((item) => item.rescale(msg.widthRatio));
          // alert user on success
          figma.notify(`⚡️ Hurray! Your selection has been resized by the width.`);
        } else if (msg.type === "resize-by-height") {
          // scale each node based on height input
          selection.forEach((item) => item.rescale(msg.heightRatio));
          // alert user on success
          figma.notify(`⚡️ Hurray! Your selection has been resized by the height.`);
        }
      };
    }
  }

  // check for selection changes while plugin is running
  figma.on("selectionchange", () => {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      selection.length > 1
        ? figma.notify(`${selection.length} layers selected`, { timeout: 100 })
        : figma.notify(`${selection[0].name} selected`, { timeout: 100 });

      for (const node of selection as any) {
        figma.ui.postMessage({
          objectWidth: node.width,
          objectHeight: node.height,
          percentage: 100,
        });

        // alert user on success
        figma.ui.onmessage = async (msg) => {
          if (msg.type === "resize-by-percentage") {
            selection.forEach((item) => item.rescale(msg.percentageRatio));
            figma.notify(`⚡️ Hurray! Your selection has been resized by the percentage.`);
          } else if (msg.type === "resize-by-width") {
            selection.forEach((item) => item.rescale(msg.widthRatio));
            figma.notify(`⚡️ Hurray! Your selection has been resized by the width.`);
          } else if (msg.type === "resize-by-height") {
            selection.forEach((item) => item.rescale(msg.heightRatio));
            figma.notify(`⚡️ Hurray! Your selection has been resized by the height.`);
          }
        };
      }
    } else {
      figma.notify(`😭 Sorry! You aren't actively selecting a layer.`, { timeout: 200 });

      figma.ui.postMessage({
        objectWidth: 0,
        objectHeight: 0,
        percentage: 0,
      });
    }
  });
}

if (selection.length === 0) {
  figma.ui.postMessage({
    objectWidth: 0,
    objectHeight: 0,
    percentage: 0,
  });

  // // alert the user on what to do
  figma.notify(`Please select a layer to get started.`, { timeout: 2000 });

  figma.ui.onmessage = async (msg) => {
    if (msg.percentage === "0") {
      figma.notify(`😭 Sorry! You aren't actively selecting a layer.`, { timeout: 200 });

      figma.ui.postMessage({
        objectWidth: 0,
        objectHeight: 0,
        percentage: 0,
      });
    }
  };
}
