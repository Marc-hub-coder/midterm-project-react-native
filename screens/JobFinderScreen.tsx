import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import uuid from 'react-native-uuid';
import { useJobs } from '../context/JobContext';
import { Job } from '../context/Job';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const JobFinderScreen = ({ navigation }: any) => {
  const { jobs, setJobs, savedJobs, setSavedJobs, saveJob } = useJobs();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://empllo.com/api/v1');

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.jobs && Array.isArray(result.jobs)) {
        const jobsWithIds = result.jobs.map((job: any) => {
          console.log('Job data:', job);
          return {
            id: uuid.v4().toString(),
            title: job.title || 'No Title',
            company: job.company || job.companyName || 'Company not specified',
            salary: job.salary || 'Not specified',
            location: job.location,
            jobType: job.jobType || 'Full Time',
            companyLogo: job.companyLogo || '',
            companyLocation: job.companyLocation,
          };
        });

        setJobs(jobsWithIds);
      } else {
        setError('Unexpected API response format.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isJobSaved = (job: Job) => {
    return savedJobs.some(
      (savedJob) => savedJob.title === job.title && savedJob.company === job.company
    );
  };

  const handleApply = (job: Job) => {
    navigation.navigate('ApplicationForm', { job });
  };

  const handleSaveJob = (job: Job) => {
    const isDuplicate = isJobSaved(job);

    if (isDuplicate) {
      Alert.alert('Duplicate Job', 'You have already saved this job.');
    } else {
      saveJob(job);
      Alert.alert('Job Saved', 'The job has been saved successfully!');
    }
  };

  const renderJobCard = ({ item }: { item: Job }) => {
    const saved = isJobSaved(item);
    
    return (
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
          <TouchableOpacity 
            style={styles.bookmarkButton}
            onPress={() => handleSaveJob(item)}
          >
            <Ionicons 
              name={saved ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={saved ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
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

        <TouchableOpacity 
          style={[styles.applyButton, { backgroundColor: colors.secondary }]}
          onPress={() => handleApply(item)}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Job Feed</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon"} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.subText, { color: colors.textSecondary }]}>The better way to find your fancy job here</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
        <Ionicons name="search" size={24} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search job here..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobCard}
          showsVerticalScrollIndicator={false}
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
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeToggle: {
    padding: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  jobCard: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
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
  bookmarkButton: {
    padding: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    marginBottom: 12,
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
  applyButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  jobsList: {
    paddingBottom: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default JobFinderScreen;
