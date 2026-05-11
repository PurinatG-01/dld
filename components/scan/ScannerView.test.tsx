import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ScannerView } from './ScannerView'
import { InventoryProvider } from '@/lib/inventory-context'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

function Wrapper({ children }: { children: React.ReactNode }) {
  return <InventoryProvider>{children}</InventoryProvider>
}

describe('ScannerView', () => {
  beforeEach(() => mockPush.mockClear())

  it('renders in scan-in mode', () => {
    render(<ScannerView mode="in" />, { wrapper: Wrapper })
    expect(screen.getByText('Scan In')).toBeInTheDocument()
    expect(screen.getByText('Confirm Restock')).toBeInTheDocument()
  })

  it('renders in scan-out mode', () => {
    render(<ScannerView mode="out" />, { wrapper: Wrapper })
    expect(screen.getByText('Scan Out')).toBeInTheDocument()
    expect(screen.getByText('Confirm Dispense')).toBeInTheDocument()
  })

  it('shows error when confirming without selecting a product', () => {
    render(<ScannerView mode="out" />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('Confirm Dispense'))
    expect(screen.getByText('Select a product to scan')).toBeInTheDocument()
  })

  it('navigates to dashboard on cancel', () => {
    render(<ScannerView mode="in" />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('navigates to dashboard on close button', () => {
    render(<ScannerView mode="in" />, { wrapper: Wrapper })
    fireEvent.click(screen.getByLabelText('Close scanner'))
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('shows success after confirming scan-in', async () => {
    render(<ScannerView mode="in" />, { wrapper: Wrapper })
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'prod-1' } })
    fireEvent.click(screen.getByText('Confirm Restock'))
    await waitFor(() => {
      expect(screen.getByText('Item restocked successfully')).toBeInTheDocument()
    })
  })
})
