import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics';
import ProfitabilityReport from '@/components/analytics/ProfitabilityReport';
import InventoryAnalytics from '@/components/analytics/InventoryAnalytics';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Business Intelligence
          </h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights</p>
        </div>
      </div>

      <Tabs defaultValue="advanced" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="advanced">
          <AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="profitability">
          <ProfitabilityReport />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}