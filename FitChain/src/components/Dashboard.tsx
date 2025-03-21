// components/Dashboard.js
import React, { FC } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useFitChain } from '../hooks';
import { useClaimReward } from '../hooks/useClaimReward';
import { useCountdown } from '../hooks/useCountdown';
import { ContractStatus, FundContractButton } from './FundContractButton';
import { NFTGallery } from './NFTGallery';
import StepsStatus from './StepsStatus';
import Card from './ui/Card';

export const Dashboard: FC = () => {
  const { data, isLoading, error, isError } = useFitChain();
  const { handleClaim, isPending } = useClaimReward();
  const remainingTime = useCountdown(Number(data?.cooldown || 0));

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  const { nextMilestone, cooldown, etnClaimed, totalSteps } = data;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s remaining`;
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text>nextMilestone: {nextMilestone}</Text>
        <Text>cooldown: {cooldown}</Text>
        <Text>etnClaimed: {etnClaimed}</Text>
        <Text>totalSteps: {totalSteps}</Text>
        <Text style={styles.bold}>
          Next Milestone: <Text style={styles.value}>{nextMilestone} Steps</Text>
        </Text>
        <Text style={styles.bold}>
          Next Claim Available:{' '}
          <Text style={styles.value}>{remainingTime > 0 ? formatTime(remainingTime) : 'Ready to claim!'}</Text>
        </Text>
      </Card>
      <NFTGallery />
      <ContractStatus />
      <FundContractButton />
      <StepsStatus />
      {remainingTime <= 0 && <Button title="Claim Rewards" onPress={() => handleClaim(10)} disabled={isPending} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bold: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  value: {
    fontWeight: 'normal',
  },
});
