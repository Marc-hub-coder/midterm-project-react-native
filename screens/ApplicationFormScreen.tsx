import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useJobs } from '../context/JobContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ApplicationFormScreen = ({ route, navigation }: any) => {
  const { job } = route.params;
  const { applyForJob } = useJobs();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whyHireYou: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    whyHireYou: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      whyHireYou: '',
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be 11 digits';
      isValid = false;
    }

    if (!formData.whyHireYou.trim()) {
      newErrors.whyHireYou = 'Please tell us why we should hire you';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      applyForJob(job);
      navigation.navigate('MainTabs', {
        screen: 'JobsApplied'
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.tagBackground }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Apply for Job</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon"} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.subText, { color: colors.textSecondary }]}>Fill in your details to apply</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainContainer, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.jobSection}>
            <View style={styles.jobHeader}>
              {job.companyLogo ? (
                <Image 
                  source={{ uri: job.companyLogo }} 
                  style={styles.companyLogo}
                />
              ) : (
                <View style={[styles.companyLogo, { backgroundColor: colors.primary }]}>
                  <Text style={styles.companyInitial}>{job.company[0]}</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
            <Text style={[styles.companyName, { color: colors.textSecondary }]}>{job.company}</Text>
            <Text style={[styles.companyLocation, { color: colors.textSecondary }]}>{job.companyLocation}</Text>
            
            <View style={styles.jobTags}>
              <View style={[styles.tag, { backgroundColor: colors.tagBackground }]}>
                <Ionicons name="time" size={14} color={colors.textSecondary} style={styles.tagIcon} />
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>{job.jobType}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: colors.tagBackground }]}>
                <Ionicons name="cash" size={14} color={colors.textSecondary} style={styles.tagIcon} />
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>{job.salary}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.formSection}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Personal Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: errors.name ? colors.error : colors.border
                  }
                ]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  setErrors({ ...errors, name: '' });
                }}
              />
              {errors.name ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: errors.email ? colors.error : colors.border
                  }
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  setErrors({ ...errors, email: '' });
                }}
              />
              {errors.email ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: errors.phone ? colors.error : colors.border
                  }
                ]}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                maxLength={11}
                value={formData.phone}
                onChangeText={(text) => {
                  setFormData({ ...formData, phone: text });
                  setErrors({ ...errors, phone: '' });
                }}
              />
              {errors.phone ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.phone}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Why should we hire you?</Text>
              <TextInput
                style={[
                  styles.input, 
                  styles.textArea,
                  { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: errors.whyHireYou ? colors.error : colors.border
                  }
                ]}
                placeholder="Tell us why you're the perfect candidate"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={formData.whyHireYou}
                onChangeText={(text) => {
                  setFormData({ ...formData, whyHireYou: text });
                  setErrors({ ...errors, whyHireYou: '' });
                }}
              />
              {errors.whyHireYou ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.whyHireYou}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Application</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
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
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  mainContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobSection: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  formSection: {
    marginTop: 20,
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
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplicationFormScreen;
