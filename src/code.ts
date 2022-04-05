// show ui in figma
figma.showUI(__html__, { width: 384, height: 272 });

// scale function
const scale = (input: string, alignment?: string) => {
  // convert string to integer
  const ratio = parseFloat(input);

  // traverse selection tree
  for (const node of figma.currentPage.selection) {
    // check if child can be scaled
    if ("rescale" in node) {
      const currentCenterX = node.width / 2;
      const centerX = node.x + currentCenterX;
      const rightX = node.x + node.width;
      const currentCenterY = node.height / 2;
      const centerY = node.y + currentCenterY;
      const rightY = node.y + node.width;

      node.rescale(ratio);

      figma.ui.postMessage({
        objectWidth: node.width | 0,
        objectHeight: node.height | 0,
        percentage: 100,
      });

      const horizontalCenter = node.width / 2;
      const horizontalRight = node.width;
      const verticalCenter = node.height / 2;
      const verticalBottom = node.height;

      switch (alignment) {
        case "top-left":
          break;
        case "top-center":
          node.x = centerX - horizontalCenter;
          break;
        case "top-right":
          node.x = rightX - horizontalRight;
          break;
        case "middle-left":
          node.y = centerY - verticalCenter;
          break;
        case "middle-center":
          node.y = centerY - verticalCenter;
          node.x = centerX - horizontalCenter;
          break;
        case "middle-right":
          node.y = centerY - verticalCenter;
          node.x = rightX - horizontalRight;
          break;
        case "bottom-left":
          node.y = rightY - verticalBottom;
          break;
        case "bottom-center":
          node.y = rightY - verticalBottom;
          node.x = centerX - horizontalCenter;
          break;
        case "bottom-right":
          node.y = rightY - verticalBottom;
          node.x = rightX - horizontalRight;
          break;
      }
    }
  }
};

// check type of input from UI
const checkType = (type, msg) => {
  // scale each node based on percentage input
  switch (type) {
    case "resize-by-percentage":
      scale(msg.percentageRatio, msg.buttonType);
      // alert user
      notification();
      break;
    // scale each node based on width input
    case "resize-by-width":
      scale(msg.widthRatio, msg.buttonType);
      // alert user
      notification();
      break;
    // scale each node based on height input
    case "resize-by-height":
      scale(msg.heightRatio, msg.buttonType);
      // alert user
      notification();
      break;
  }
};

// post object values to UI
const postMsgToUI = (percentage: any, node?: any) => {
  figma.ui.postMessage({
    // width and height can be value of objects or 0
    objectWidth: node.width | 0,
    objectHeight: node.height | 0,
    percentage: percentage,
  });
};

// send notifications based on type
const notification = (type?: string) => {
  switch (type) {
    // error notifiation
    case "error":
      figma.notify(`😭 Sorry! You aren't actively selecting a layer.`);
      break;
    // helper notification
    case "helper":
      figma.notify(`Please select a layer to get started.`, { timeout: 2000 });
      break;
    // default success notification
    default:
      figma.notify(`⚡️ Hurray! Your selection has been resized by the percentage.`);
      break;
  }
};

if (figma.currentPage.selection.length === 0) {
  // set UI value to 0
  postMsgToUI(0, 0);
  // alert the user what to do
  notification("helper");
  // receive user input from UI
  figma.ui.onmessage = async (msg) => {
    if (msg.percentage === "0") {
      notification("error");
      // set UI value to 0
      postMsgToUI(0, 0);
    }
  };
}

// traverse selection tree
for (const node of figma.currentPage.selection) {
  if ("rescale" in node) {
    // send selection parameters to UI
    postMsgToUI(100, node);
    // receive user input from UI
    figma.ui.onmessage = async (msg) => {
      // check for type and scale
      checkType(msg.type, msg);
    };
  }
}

// check for selection changes while plugin is running
figma.on("selectionchange", () => {
  // traverse selection tree
  for (const node of figma.currentPage.selection) {
    // alert user when selecting objects
    figma.currentPage.selection.length > 1
      ? figma.notify(`${figma.currentPage.selection.length} layers selected`, { timeout: 100 })
      : figma.notify(`${node.name} selected`, { timeout: 100 });

    if ("rescale" in node) {
      // send selection parameters to UI
      postMsgToUI(100, node);
      // receive user input from UI
      figma.ui.onmessage = async (msg) => {
        // check for type and scale
        checkType(msg.type, msg);
      };
    }
  }
});
