import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'

describe('useCalculator', () => {
  it('starts with totalCost of 0', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.totalCost).toBe(0)
  })

  it('sums base items correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.updateItem(1, '10000') }) // אלומיניום
    act(() => { result.current.updateItem(2, '5000') })  // פירזול
    // baseTotal = 15000, percentTotal = 15000 * 0.10 + 15000 * 0.10 = 3000
    // totalCost = 18000
    expect(result.current.totalCost).toBe(18000)
  })

  it('calculates targetPrice correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.updateItem(1, '90000') })
    // baseTotal = 90000, percentTotal = 18000, totalCost = 108000
    // targetMargin default = 25
    // targetPrice = 108000 / (1 - 0.25) = 144000
    expect(result.current.totalCost).toBe(108000)
    expect(result.current.targetPrice).toBeCloseTo(144000, 0)
  })

  it('calculates realMargin correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.updateItem(1, '90000') }) // totalCost = 108000
    act(() => { result.current.setClientPrice('135000') })
    // realProfit = 135000 - 108000 = 27000
    // realMargin = (27000 / 135000) * 100 = 20
    expect(result.current.realMargin).toBeCloseTo(20, 1)
  })

  it('calculates delta correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.updateItem(1, '90000') }) // totalCost=108000, targetPrice=144000
    act(() => { result.current.setClientPrice('130000') })
    // delta = 144000 - 130000 = 14000
    expect(result.current.delta).toBeCloseTo(14000, 0)
  })

  it('addExtraItem increases totalCost', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.addExtraItem('בונוס') })
    const newId = result.current.extraItems[0].id
    act(() => { result.current.updateExtraItem(newId, '5000') })
    // baseTotal = 5000, percentTotal = 1000, totalCost = 6000
    expect(result.current.totalCost).toBe(6000)
  })

  it('removeExtraItem decreases totalCost', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.addExtraItem('בונוס') })
    const id = result.current.extraItems[0].id
    act(() => { result.current.updateExtraItem(id, '5000') })
    act(() => { result.current.removeExtraItem(id) })
    expect(result.current.totalCost).toBe(0)
  })

  it('updatePercentItem changes percentTotal', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.updateItem(1, '10000') })
    act(() => { result.current.updatePercentItem(8, 20) }) // התקנה → 20%
    // baseTotal=10000, percentTotal = 10000*0.20 + 10000*0.10 = 3000, totalCost=13000
    expect(result.current.totalCost).toBe(13000)
  })
})
