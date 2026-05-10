import { render, screen } from '@testing-library/react'
import { FlashMessage } from './FlashMessage'

describe('FlashMessage', () => {
  it('renders the message text', () => {
    render(<FlashMessage message="Restocked: Lidocaine 2%" />)
    expect(screen.getByText('Restocked: Lidocaine 2%')).toBeInTheDocument()
  })

  it('renders nothing when message is null', () => {
    const { container } = render(<FlashMessage message={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
