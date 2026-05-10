import { render, screen } from '@testing-library/react'
import { Package } from 'lucide-react'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Items" value="262" icon={Package} color="bg-indigo-500" />)
    expect(screen.getByText('Total Items')).toBeInTheDocument()
    expect(screen.getByText('262')).toBeInTheDocument()
  })

  it('renders trend badge when provided', () => {
    render(<StatCard label="Total Items" value="262" icon={Package} color="bg-indigo-500" trend="+12%" />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })

  it('omits trend badge when not provided', () => {
    render(<StatCard label="Total Items" value="262" icon={Package} color="bg-indigo-500" />)
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
  })
})
