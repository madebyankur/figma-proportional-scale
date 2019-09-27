// 1. Grab current selection (only first one if more nodes are selection)
const selection = figma.currentPage.selection

// 2. Show Plugin UI
figma.showUI(__html__, {width: 240, height: 400 })

// 3. Send data to plugin UI
figma.ui.postMessage({
  "objectWidth": selection["0"].width,
  "objectHeight": selection["0"].height,
  "objectStroke": selection["0"].strokeWeight,
  "objectRadius": selection["0"].cornerRadius,
})

// 4. Receive data from plugin UI
figma.ui.onmessage = msg => {
    if (msg.type === 'error' === true) {
      figma.notify(`Whoops! Please enter a value in one of the inputs below. 😔 `)
    } else {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    msg.type === 'resizePercentage' === true ?
      selection.forEach(node => {
        selection["0"].resize(Math.round(msg.width * msg.ratioPercentage), Math.round(msg.height * msg.ratioPercentage))
        selection["0"].strokeWeight = Math.round(msg.stroke * msg.ratioPercentage)
        selection["0"].cornerRadius = Math.round(msg.radius * msg.ratioPercentage)
      })
    : msg.type === 'resizeWidth' === true ?
      selection.forEach(node => {
        selection["0"].resize(msg.width, Math.round(msg.height * msg.ratioWidth))
        selection["0"].strokeWeight = Math.round(msg.stroke * msg.ratioWidth)
        selection["0"].cornerRadius = Math.round(msg.radius * msg.ratioWidth)
      })
    : msg.type === 'resizeHeight' === true ?
      selection.forEach(node => {
        selection["0"].resize(Math.round(msg.width * msg.ratioHeight), msg.height)
        selection["0"].strokeWeight = Math.round(msg.stroke * msg.ratioHeight)
        selection["0"].cornerRadius = Math.round(msg.radius * msg.ratioHeight)
      })
    : msg.type === false

    figma.closePlugin()

    figma.notify(`⚡️ Hurray! Your selection has been resized.`)

    }
  }
