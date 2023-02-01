class Modal {
  create () {
    const appElement = document.querySelector<HTMLDivElement>('#app')
    const maskElement = document.createElement('div')
    const modalElement = document.createElement('div')
    maskElement.className = 'mask'
    modalElement.classList.add('modal')
    maskElement.append(modalElement)
    appElement?.append(maskElement)
  }

  show (text: string) {
    const maskElement = document.querySelector<HTMLDivElement>('.mask')
    const modalElement = document.querySelector<HTMLDivElement>('.modal')
    if (modalElement != null) modalElement.innerText = `${text}`
    if (maskElement != null) maskElement.classList.add('show')
  }

  delete () {
    const maskElement = document.querySelector<HTMLDivElement>('.mask')
    if (maskElement != null) maskElement.classList.remove('show')
  }
}

export default Modal
