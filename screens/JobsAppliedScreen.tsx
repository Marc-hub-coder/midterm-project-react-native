import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useJobs } from '../context/JobContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const JobsAppliedScreen = ({ navigation }: any) => {
  const { appliedJobs } = useJobs();
  const { colors, isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerTop, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>Jobs Applied</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons 
            name={isDarkMode ? "sunny" : "moon"} 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      {appliedJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="briefcase-outline" size={64} color={colors.primary} />
          <Text style={[styles.noJobs, { color: colors.textSecondary }]}>No applications yet</Text>
        </View>
      ) : (
        <FlatList
          data={appliedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.jobCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.jobHeader}>
                {item.companyLogo ? (
                  <Image 
                    source={{ uri: item.companyLogo }} 
                    style={styles.companyLogo}
                  />
                ) : (
                  <View style={[styles.companyLogo, { backgroundColor: colors.primary }]}>
                    <Text style={styles.companyInitial}>{item.company[0]}</Text>
                  </View>
                )}
                <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
                  <Text style={styles.statusText}>Applied</Text>
                </View>
              </View>
              
              <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.companyName, { color: colors.textSecondary }]}>{item.company}</Text>
              <Text style={[styles.companyLocation, { color: colors.textSecondary }]}>{item.companyLocation}</Text>
              
              <View style={styles.jobTags}>
                <View style={[styles.tag, { backgroundColor: colors.tagBackground }]}>
                  <Ionicons name="time" size={14} color={colors.textSecondary} style={styles.tagIcon} />
                  <Text style={[styles.tagText, { color: colors.textSecondary }]}>{item.jobType}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: colors.tagBackground }]}>
                  <Ionicons name="cash" size={14} color={colors.textSecondary} style={styles.tagIcon} />
                  <Text style={[styles.tagText, { color: colors.textSecondary }]}>{item.salary}</Text>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.jobsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  themeToggle: {
    padding: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noJobs: {
    fontSize: 16,
    marginTop: 16,
  },
  jobsList: {
    padding: 20,
  },
  jobCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    marginBottom: 4,
  },
  companyLocation: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  jobTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
  },
});

export default JobsAppliedScreen;
