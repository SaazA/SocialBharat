import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {getChatMatrimonial, sendTextMatrimonial} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';

import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../constants/colors';

moment.relativeTimeThreshold('d', 30);
const ChatScreenMatrimonial = ({route, navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [chatData, setChatData] = useState(null);
  const {partnerId} = route.params;
  const {partnerName} = route.params;
  console.log(partnerId, partnerName);
  const scrollViewRef = useRef();
  const messages = 'messages';
  const [message, setMessage] = useState('');
  const getChat = () => {
    getChatMatrimonial(token, partnerId, messages)
      .then(response => {
        console.log('Messages', JSON.stringify(response.data));
        setChatData(response.data);
      })
      .catch(error => {
        console.log(error);
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

  const sendMessage = () => {
    const receiver_id = partnerId;
    console.log(message);
    sendTextMatrimonial(token, receiver_id, message)
      .then(response => {
        // console.log('Message' + JSON.stringify(response));
        setMessage(''); // Reset message after sending
        getChat();
        scrollToBottom();
      })
      .catch(error => {
        console.log(error);
        const {errors, message} = error.response.data;
        // console.log(errors, 'ass', message);
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
            <Text style={styles.headerbarname}>{partnerName}</Text>
          </View>
        </View>
      </View>

      <View style={styles.secondcontainer}>
        <ScrollView ref={scrollViewRef}>
          {chatData && chatData.length > 0 ? (
            chatData
              .slice()
              .reverse()
              .map(chat => {
                return (
                  <View key={chat.id} style={styles.textcontainer}>
                    {chat.sender_id === partnerId ? (
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
            <View>
              <Text style={styles.nochat}>No Chat Available</Text>
            </View>
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
  nochat: {
    color: colors.white,
    fontSize: 18,
    margin: 20,
  },
});

export default ChatScreenMatrimonial;
