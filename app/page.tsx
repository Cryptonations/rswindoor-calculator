'use client'

import { useCalculator } from '@/hooks/useCalculator'
import Header from '@/components/Header'
import CostList from '@/components/CostList'
import TotalCost from '@/components/TotalCost'
import MarginCalculator from '@/components/MarginCalculator'
import ScenarioReal from '@/components/ScenarioReal'
import ScenarioTarget from '@/components/ScenarioTarget'
import DeltaBlock from '@/components/DeltaBlock'
import styles from './page.module.css'

export default function Page() {
  const calc = useCalculator()

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.content}>
        <CostList
          items={calc.items}
          percentItems={calc.percentItems}
          extraItems={calc.extraItems}
          baseTotal={calc.baseTotal}
          onUpdateItem={calc.updateItem}
          onUpdatePercent={calc.updatePercentItem}
          onUpdateExtra={calc.updateExtraItem}
          onAddExtra={calc.addExtraItem}
          onRemoveExtra={calc.removeExtraItem}
        />
        <TotalCost totalCost={calc.totalCost} />
        <MarginCalculator
          targetMargin={calc.targetMargin}
          targetPrice={calc.targetPrice}
          targetProfit={calc.targetProfit}
          onChangeMargin={calc.setTargetMargin}
        />
        <div className={styles.sectionLabel}>השוואה</div>
        <div className={styles.scenariosGrid}>
          <ScenarioReal
            clientPrice={calc.clientPrice}
            realProfit={calc.realProfit}
            realMargin={calc.realMargin}
            targetMargin={calc.targetMargin}
            onChangePrice={calc.setClientPrice}
          />
          <ScenarioTarget
            targetPrice={calc.targetPrice}
            targetProfit={calc.targetProfit}
            targetMargin={calc.targetMargin}
          />
        </div>
        <DeltaBlock delta={calc.delta} realPrice={calc.realPrice} />
      </div>
    </div>
  )
}
