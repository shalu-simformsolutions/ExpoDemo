import ParallaxScrollView from '@/components/parallax-scroll-view';
import * as Updates from 'expo-updates';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const AppUpdateScreen = () => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Check for updates manually
  const checkForUpdates = async (): Promise<void> => {
    setIsChecking(true);
    try {
      const update = await Updates.checkForUpdateAsync();
      setUpdateAvailable(update.isAvailable);
      if (update.isAvailable) {
        setModalVisible(true); // Show update popup
      } else {
        Alert.alert('No Updates', 'Your app is up to date.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check for updates.');
    } finally {
      setIsChecking(false);
    }
  };

  // Download and apply updates
  const downloadAndApplyUpdate = async (): Promise<void> => {
    setIsDownloading(true);
    try {
      const update = await Updates.fetchUpdateAsync();
      if (update.isNew) {
        Alert.alert(
          'Update Downloaded',
          'Restarting the app to apply updates.'
        );
        await Updates.reloadAsync();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to apply update.');
    } finally {
      setIsDownloading(false);
      setModalVisible(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: '#000000',
        dark: '#1D3D47',
      }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>🔄 Expo OTA Updates</Text>
        <TouchableOpacity style={styles.checkButton} onPress={checkForUpdates}>
          {isChecking ? (
            <ActivityIndicator size='small' color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Check for Updates</Text>
          )}
        </TouchableOpacity>
        {updateAvailable && (
          <Text style={styles.updateMessage}>
            ✅ Update Available! Tap to Install
          </Text>
        )}
        {/* Update Modal */}
        <Modal animationType='slide' transparent visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Update Available!</Text>
              <Text style={styles.modalText}>
                Would you like to install the latest update now?
              </Text>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={downloadAndApplyUpdate}
              >
                {isDownloading ? (
                  <ActivityIndicator size='small' color='#fff' />
                ) : (
                  <Text style={styles.buttonText}>Download & Install</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  checkButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 15,
  },
  cancelButton: {
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  updateMessage: {
    fontSize: 16,
    color: '#1ea82d',
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelText: {
    color: '#FF0000',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AppUpdateScreen;
