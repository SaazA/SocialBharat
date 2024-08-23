import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import {getChatMatrimonial, sendTextMatrimonial} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';

import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../constants/colors';

moment.relativeTimeThreshold('d', 30);
const ChatScreenMembers = ({route, navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [chatData, setChatData] = useState(null);
  const {memberId} = route.params;
  const {memberName} = route.params;
  const scrollViewRef = useRef();
  const messages = 'messages';
  const [message, setMessage] = useState('');
  const [noData, setNoData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const getChat = () => {
    setApiFailed(false);
    getChatMatrimonial(token, memberId, messages)
      .then(response => {
        console.log('Messages', response.data);
        setChatData(response.data);
        if (response.data.length < 1) {
          setNoData(true);
        }
      })
      .catch(error => {
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };
  //   const sendMessage = () => {
  //     const receiver_id = partnerId;
  //     sendTextMatrimonial(token, receiver_id, message)
  //       .then(response => {
  //         console.log('Message' + JSON.stringify(response));
  //         setMessage('');
  //         getChat();
  //         scrollToBottom();
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getChat();
    setRefreshing(false);
  }, []);

  const sendMessage = () => {
    const receiver_id = memberId;
    console.log(message);
    sendTextMatrimonial(token, receiver_id, message)
      .then(response => {
        // console.log('Message' + JSON.stringify(response));
        setMessage(''); // Reset message after sending
        getChat();
        scrollToBottom();
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({animated: false});
      }
    }, 100);
  };

  useEffect(() => {
    getChat();
  }, []);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [chatData]);

  const handlepressback = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.maincontianer}>
      <View style={styles.firstcontainer}>
        <View style={styles.headerbarimageandnamecontainer}>
          <View>
            <FontAwesome5
              name="arrow-left"
              color={colors.white}
              size={30}
              onPress={handlepressback}
            />
          </View>
          <View style={styles.headerbarimagecontainer}>
            <Image
              source={require('../../../assests/nullphotocover.jpg')}
              style={styles.headerbarimage}></Image>
          </View>
          <View>
            <Text style={styles.headerbarname}>{memberName}</Text>
          </View>
        </View>
      </View>

      <View style={styles.secondcontainer}>
        <ScrollView
          ref={scrollViewRef}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {chatData && chatData.length > 0 ? (
            chatData
              .slice()
              .reverse()
              .map(chat => {
                return (
                  <View key={chat.id} style={styles.textcontainer}>
                    {chat.sender_id === memberId ? (
                      <View style={styles.partnermessage}>
                        <Text style={styles.chattext}>{chat.message}</Text>
                        <Text style={styles.chattime}>
                          {moment(chat.timestamp).fromNow()}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.usermessage}>
                        <Text style={styles.chattext}>{chat.message}</Text>
                        <Text style={styles.chattime}>
                          {moment(chat.timestamp).fromNow()}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })
          ) : (
            <>
              {noData && !apiFailed ? (
                <View style={styles.nomoretextcontainer}>
                  <Text style={styles.nomoretext}>Start a Conversation</Text>
                </View>
              ) : apiFailed ? (
                <View style={styles.nodatacontainer}>
                  <Text style={styles.nomoretext}>
                    Check your Internet, pull to refresh
                  </Text>
                </View>
              ) : (
                <ActivityIndicator size="large" color="#0000ff" />
              )}
            </>
          )}
        </ScrollView>
      </View>

      {/* <View style={styles.bottomcontainer}>
      <TextInput
  style={styles.bottomcontainertextbox}
  value={message}
  onChangeText={text => {
    // Trim leading and trailing whitespace
    const trimmedText = text.trim();
    // Update state only if trimmedText is not empty
    if (trimmedText !== "") {
      setMessage(trimmedText);
    }
  }}
  placeholder='Type your message here'
  placeholderTextColor={colors.black}
/>

          <TouchableOpacity onPress={sendMessage}  style={styles.bottomcontainersendbox}>
        <View style={styles.sendtext}>
        <FontAwesome
              name="send-o"
              color={colors.white}
              size={30}
              onPress={handlepressback}
            />
        </View>
          </TouchableOpacity>
      </View> */}
      {/* <View style={styles.bottomcontainer}>
  <TextInput
    style={styles.bottomcontainertextbox}
    value={message}
    onChangeText={text => {
      // Trim leading and trailing whitespace
      const trimmedText = text.trim();
      // Update state only if trimmedText is not empty
      if (trimmedText !== "") {
        setMessage(trimmedText);
      }
    }}
    placeholder='Type your message here'
    placeholderTextColor={colors.black}
  />
  {message.trim() !== "" && ( // Conditionally render TouchableOpacity
    <TouchableOpacity onPress={sendMessage} style={styles.bottomcontainersendbox}>
      <View style={styles.sendtext}>
        <FontAwesome
          name="send-o"
          color={colors.white}
          size={30}
        />
      </View>
    </TouchableOpacity>
  )}
</View> */}

      {/* <View style={styles.bottomcontainer}>
  <TextInput
    style={styles.bottomcontainertextbox}
    value={message}
    onChangeText={text => {
      // Update state with the trimmed text
      setMessage(text.trim());
    }}
    onEndEditing={() => {
      // Check if the trimmed message is empty
      if (message.trim() === "") {
        // If empty, set the message state to an empty string
        setMessage("");
      }
    }}
    placeholder='Type your message here'
    placeholderTextColor={colors.black}
  />
  {message.trim() !== "" && ( // Conditionally render TouchableOpacity
    <TouchableOpacity onPress={sendMessage} style={styles.bottomcontainersendbox}>
      <View style={styles.sendtext}>
        <FontAwesome
          name="send-o"
          color={colors.white}
          size={26}
        />
      </View>
    </TouchableOpacity>
  )}
</View> */}

      <View style={styles.bottomcontainer}>
        <TextInput
          style={styles.bottomcontainertextbox}
          value={message}
          onChangeText={text => {
            // Update state with the text
            setMessage(text);
          }}
          onEndEditing={() => {
            // Optionally, you can handle end editing if needed
          }}
          placeholder="Type your message here"
          placeholderTextColor={colors.black}
        />
        {message.trim() !== '' && (
          <TouchableOpacity
            onPress={sendMessage}
            style={styles.bottomcontainersendbox}>
            <View style={styles.sendtext}>
              <FontAwesome name="send-o" color={colors.white} size={26} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontianer: {
    flex: 1,
    backgroundColor: '#111B21',
  },
  firstcontainer: {
    margin: 0,
    height: 55,
    backgroundColor: '#008577',
  },
  secondcontainer: {
    flex: 1,
  },

  headerbarimageandnamecontainer: {
    flexDirection: 'row',
    marginLeft: 10,
    gap: 15,
    alignItems: 'center',
    height: 55,
  },
  headerbarimagecontainer: {},
  headerbarimage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerbarname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  textcontainer: {
    padding: 10,
  },
  partnermessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ADD8E6',
    width: '70%',
    borderRadius: 20,
    padding: 10,
    paddingLeft: 20,
    gap: 10,
  },
  usermessage: {
    width: '70%',
    alignSelf: 'flex-end',
    backgroundColor: '#90EE90',
    borderRadius: 20,
    padding: 10,
    paddingLeft: 20,
    gap: 10,
  },
  chattext: {
    color: colors.black,
    fontSize: 16,
  },
  chattime: {
    color: colors.black,
  },
  bottomcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 5,
    backgroundColor: '#008577',
  },
  bottomcontainertextbox: {
    flex: 1,
    borderWidth: 1,
    marginRight: 5,
    flexWrap: 'wrap',
    borderRadius: 20,
    backgroundColor: colors.white,
    color: colors.black,
  },
  bottomcontainersendbox: {
    flex: 0.35,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendtext: {
    backgroundColor: '#90EE90',
    width: 50,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    borderRadius: 30,
  },
  nomoretextcontainer: {
    borderWidth: 1,
    margin: 10,
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: colors.grayLight,
    padding: 5,
  },
  nomoretext: {
    fontSize: 20,
    color: colors.blue,
  },
  nodatacontainer: {
    borderWidth: 1,
    margin: 10,
    flex: 1,
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: colors.grayLight,
    padding: 5,
  },
});

export default ChatScreenMembers;
