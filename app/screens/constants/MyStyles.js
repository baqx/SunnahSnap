import { StyleSheet, Platform } from 'react-native';

// Modern Color Palette
const colors = {
  primary: '#6a3eb2',
  primaryDark: '#5a2d9f',
  primaryLight: '#8b5fc7',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  accent: '#fbbf24',
  error: '#ef4444',
  success: '#10b981',
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  appTitle: {
    fontWeight: '700',
    fontSize: 28,
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  appSubtitle: {
    fontWeight: '400',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.3,
  },
  recCard: {
    padding: 20,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 22,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    color: colors.text,
    letterSpacing: 0.3,
  },
  recCardTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 12,
    color: colors.text,
    letterSpacing: 0.2,
  },
  recCardContent: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  recCardFoot: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
    fontWeight: '400',
  },
  icon: {
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  readMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: colors.primaryLight + '15',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  pickerContainer: {
    height: 52,
    width: '100%',
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    justifyContent: 'center',
    backgroundColor: colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: colors.text,
    backgroundColor: colors.surface,
    fontWeight: '500',
  },
  iconContainer: {
    top: 16,
    right: 16,
  },
  line: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
    opacity: 0.5,
  },
  // Modern Button Styles
  buttonPrimary: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Action Button Container
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.borderLight,
    marginHorizontal: 4,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 12,
  },
  // Settings Card
  settingsCard: {
    padding: 20,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  // Developer Info
  developerInfo: {
    padding: 20,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  developerText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  // Highlight for search
  highlightText: {
    backgroundColor: '#fef3c7',
    fontWeight: '600',
    color: colors.text,
  },
});