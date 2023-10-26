import { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Linking, TouchableHighlight, TouchableOpacity, View, TextInput } from "react-native";
import { Icon, Text } from "react-native-elements";

const width = Dimensions.get('window').width;


const SellForm = ({marketData, onClose}) => {

    const [modalVisible, setModalVisible] = useState(true);
    const [mainnet, setMainnet] = useState(false);

    const [formData, setFormData] = useState({
        price : '',
        amount : '',
        usd : '',
    });

    async function call() {
        const address = global.withAuth
        ? global.loginAccount.publicAddress
        : global.connectAccount.publicAddress;
        const web3 = global.withAuth
        ? this.createProvider()
        : this.createConnectProvider();

    }

    const handleCloseModal = () => {
        setModalVisible(false);
        onClose();
    };

    useEffect(() => {
        call();
    });

    return (
        
            <View>

                <View style={styles.buyModalContainer}>
                    <View style={styles.formContainer}>
                        {/* <View style={styles.inputContainer}>
                            <Text style={styles.label}> At Price </Text>
                            <TextInput
                                style={styles.input}
                                placeholder=""
                                placeholderTextColor="#FFFFFF"
                                editable={false}
                                value={formData.price}
                                onChangeText={(text) => setFormData({ ...formData, price: text })}
                            />
                        </View> */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}> Amount </Text>
                            <TextInput
                                style={styles.input}
                                placeholder=""
                                placeholderTextColor="#FFFFFF"
                                value={formData.amount}
                                onChangeText={(text) => setFormData({ ...formData, amount: text })}
                            />
                        </View>
                        {/* <View style={styles.inputContainer}>
                            <Text style={styles.label}> Total USD </Text>
                            <TextInput
                                style={styles.input}
                                placeholder=""
                                placeholderTextColor="#FFFFFF"
                                value={formData.usd}
                                onChangeText={(text) => setFormData({ ...formData, usd: text })}
                            />
                        </View> */}
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity
                            style={styles.depWith}
                            onPress={() => {
                                // setShowSellModal(true);
                            }}>
                            <View
                                style={[styles.innerDep, styles.innerDepColored]}>
                                {/* <DepositSvg /> */}
                                <Text style={{color: '#fff', fontSize: 14,paddingLeft:'5%', fontFamily: 'Sarala-Bold', fontWeight: 300}}>
                                    Place order
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </View>
    );
    
}

const styles = StyleSheet.create({
    modalContainer : {
        marginHorizontal: '5%',
        marginVertical: '20%',
        borderRadius: 20,
    },
    heading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    headingText: {
        fontSize: 24,
        fontFamily: `Sarala-Regular`,
        color: 'white',
    },
    topContainer: {
        backgroundColor: '#151A28',
        color: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 30,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    txnDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        marginHorizontal:10
    },
    txnDetailLabel: {
        fontSize : 14,
        color: '#9f9f9f',
        fontWeight: 400,
        fontFamily: `Sarala-Regular`,
    },
    txnDetailValue: {
        fontSize : 14,
        color: '#11212C',
        fontWeight: 500,
        fontFamily: `Sarala-Regular`,  
    },
    buttonContainer: {
        backgroundColor: '#eff3ff',
        marginHorizontal: 30,
        marginVertical: 20,
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        padding: 15
    },
    buttonText: {
        color: '#0B84FE',
        fontSize : 16, 
        fontWeight: 600,
        fontFamily: `Sarala-Regular`,
    },
    senderContainer: {
        backgroundColor: '#FFF2F2',
        padding: 10,
        borderRadius: 10
    },
    receiverContainer: {
        backgroundColor: '#F2FFF5',
        padding: 10,
        borderRadius: 10
    },
    label1: {
        color: '#E97676',
        fontSize : 16, 
        fontWeight: 600,
        fontFamily: `Sarala-Regular`,
    },
    label2: {
        color: '#2D9E5A',
        fontSize : 16, 
        fontWeight: 600,
        fontFamily: `Sarala-Regular`,
    },
    senderAddressText : {
        color: '#2C1111',
        fontSize : 16, 
        fontWeight: 500,
        fontFamily: `Sarala-Regular`,
    },
    receiverAddressText : {
        color: '#112C17',
        fontSize : 16, 
        fontWeight: 500,
        fontFamily: `Sarala-Regular`,
    },
    transactionLabel: {
        color: '#CFE8FF',
        fontSize : 16, 
        fontWeight: 500,
        fontFamily: `Sarala-Regular`,
    },
    transactionAmount: {
        color: '#FFFFFF',
        fontSize : 32, 
        fontWeight: 600,
        fontFamily: `Sarala-Regular`,
    },
    iconBackground: {
        borderRadius: 50,
        backgroundColor : 'rgba(140, 255, 207, 0.12)',
        padding: 10,
        margin: 5
    },
    iconBackground1: {
        backgroundColor: '#A0FF88',
        borderRadius: 50,
        padding:5
    },
    formContainer: {
        width: '100%',
    },
    input: {
        height: 50,
        borderWidth: 1,
        marginVertical: 10,
        padding: 10,
        borderColor: '#707070',
        color: '#c0c0c0',
        borderRadius: 10,
    },
    inputContainer: {
//         backgroundColor: '#0f0f0f',
        marginTop: 5,
        padding: 5,
        borderRadius: 10,
        shadowColor: '#707070',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    label : {
        color: '#ffffff',
        fontFamily: `Sarala-Regular`,
        fontWeight: 500
    },
    depWith: {
        flexDirection: 'row',
        height: '100%',
        width: '47%',
        borderRadius: 6,
        backgroundColor: 'red',
        justifyContent: 'center',
      },
      innerDepColored: {
        backgroundColor: '#1D1D1D',
      },
    
      innerDep: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '1%',
        // backgroundColor: '#141414',
        padding: 10
      },
});


export default SellForm;