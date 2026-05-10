import { render, screen } from '@testing-library/react'
import { StockTable } from './StockTable'
import { InventoryProvider } from '@/lib/inventory-context'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <InventoryProvider>{children}</InventoryProvider>
}

describe('StockTable', () => {
  it('renders all products', () => {
    render(<StockTable />, { wrapper: Wrapper })
    expect(screen.getByText('Composite A2 Syringe')).toBeInTheDocument()
    expect(screen.getByText('Lidocaine 2% (Cartridge)')).toBeInTheDocument()
    expect(screen.getByText('Suture Silk 4-0')).toBeInTheDocument()
  })

  it('shows Low Stock badge for products below min threshold', () => {
    render(<StockTable />, { wrapper: Wrapper })
    const lowStockBadges = screen.getAllByText('Low Stock')
    expect(lowStockBadges.length).toBeGreaterThan(0)
  })

  it('shows In Stock badge for products above min threshold', () => {
    render(<StockTable />, { wrapper: Wrapper })
    expect(screen.getAllByText('In Stock').length).toBeGreaterThan(0)
  })
})
