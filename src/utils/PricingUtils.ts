import { PricingInformationProjection } from '../libs/core-api/api';

export const findPrice = (
  plugin: string,
  priceInfo: PricingInformationProjection[],
  machineType: string,
  tier: string,
) => {
  const ventorType = plugin === 'aws-static' ? 'AWS' : 'Azure';
  const info = priceInfo.find(
    (a) => a.machineType === machineType && a.tier === tier,
  );

  return (
    info?.priceInfoPerVendors.find((a) => a.vendor === ventorType)
      ?.pricePerHour ?? 0
  );
};
