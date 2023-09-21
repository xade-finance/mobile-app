import { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Linking, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-elements";
import FastImage from "react-native-fast-image";

import Ionicons from 'react-native-vector-icons/Ionicons';
import {paymentsLoad, addXUSD, txHistoryLoad} from '../payments/utils';
import Modal from "react-native-modal";

const width = Dimensions.get('window').width;


const TransactionReceipt = ({transactionData, onClose}) => {

    const [modalVisible, setModalVisible] = useState(true);
    const [mainnet, setMainnet] = useState(false);

    async function call() {
        const address = global.withAuth
        ? global.loginAccount.publicAddress
        : global.connectAccount.publicAddress;
        const web3 = global.withAuth
        ? this.createProvider()
        : this.createConnectProvider();

        const {tokenBalance, mainnet} = await paymentsLoad(web3, address); 

        console.log('--------------------------------');
        console.log(mainnet);
        console.log("!!!!!!!!!!!!!!1");

        setMainnet(mainnet);
    }

    const handleCloseModal = () => {
        setModalVisible(false);
        onClose();
    };

    useEffect(() => {
        call();
        console.log(transactionData);
    });

    return (
        <Modal 
            animationType="slide"
            hasBackdrop={true} 
            backdropOpacity={1} 
            isVisible={modalVisible} 
            onBackdropPress={() => {
                handleCloseModal();
            }}
            style={styles.modalContainer}>
            <View>
                <View style={styles.heading}>
                    <Text style={styles.headingText}>Transaction details</Text>
                    
                    <TouchableOpacity onPress={handleCloseModal}>
                        <Ionicons name="close-outline" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.txnReceiptContainer}>
                    <View style={styles.topContainer}>
                        <View style={styles.iconBackground}>
                            <View style={styles.iconBackground1}>
                                
                                <Icon 
                                    //name="check-circle-filled"                             
                                    name={'done'}
                                    size={30}
                                    color={'#000'}
                                    type="materialicons"
                                />
                                
                            </View>
                        </View>
                        <Text style={styles.transactionLabel}>Amount Sent</Text>

                        <Text style={styles.transactionAmount}>{transactionData.value} USD</Text>
                    </View>

                    <View style={styles.bottomContainer}>
                        <View style={styles.bottomContainerText}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                marginBottom: 20
                            }}>
                                <View style={styles.senderContainer}>
                                    <Text style={styles.label1}>Sent from</Text>
                                    <Text style={styles.senderAddressText}>
                                        {transactionData.from.substring(0,5)}.......{transactionData.from.substring(transactionData.from.length-5,transactionData.from.length-1)}
                                    </Text>
                                </View>
                                <View style={styles.receiverContainer}>
                                    <Text style={styles.label2}>Sent to</Text>
                                    <Text style={styles.receiverAddressText}>
                                        {transactionData.to.substring(0,6)}.......{transactionData.to.substring(transactionData.to.length-5,transactionData.to.length-1)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.txnDetailRow}>
                                <Text style={styles.txnDetailLabel}>Transaction Date</Text>
                                <Text style={styles.txnDetailValue}>{transactionData.date}</Text>
                            </View>
                            <View style={styles.txnDetailRow}>
                                <Text style={styles.txnDetailLabel}>Transaction Time</Text>
                                <Text style={styles.txnDetailValue}>{transactionData.time}</Text>
                            </View>
                            <View style={styles.txnDetailRow}>
                                <Text style={styles.txnDetailLabel}>Amount Sent</Text>
                                <Text style={styles.txnDetailValue}>{transactionData.value}</Text>
                            </View>
                            {/* <View style={styles.txnDetailRow}>
                                <Text style={styles.txnDetailLabel}>Gas paid</Text>
                                <Text style={styles.txnDetailValue}></Text>
                            </View> */}
                        </View>

                        <TouchableOpacity style={styles.buttonContainer}
                            onPress={() => {
                                Linking.openURL(
                                    `https://${mainnet ? '' : 'mumbai.'}polygonscan.com/tx/${
                                        transactionData.hash
                                    }`,
                                );
                            }}
                        >
                            <Text style={styles.buttonText}>View on Polygonscan</Text>

                            {/* <View style={styles.bottomDots}>
								<View>
									<View style={styles.dotsSpan}></View>
									<View style={styles.dotsSpan}></View>
									<View style={styles.dotsSpan}></View>
									<View style={styles.dotsSpan}></View>
									<View style={styles.dotsSpan}></View>
									<View style={styles.dotsSpan}></View>
                                </View>
                            </View> */}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
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
        fontFamily: `EuclidCircularA-Medium`,
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
        fontFamily: `EuclidCircularA-Medium`,
    },
    txnDetailValue: {
        fontSize : 14,
        color: '#11212C',
        fontWeight: 500,
        fontFamily: `EuclidCircularA-Medium`,  
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
        fontFamily: `EuclidCircularA-Medium`,
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
        fontFamily: `EuclidCircularA-Medium`,
    },
    label2: {
        color: '#2D9E5A',
        fontSize : 16, 
        fontWeight: 600,
        fontFamily: `EuclidCircularA-Medium`,
    },
    senderAddressText : {
        color: '#2C1111',
        fontSize : 16, 
        fontWeight: 500,
        fontFamily: `EuclidCircularA-Medium`,
    },
    receiverAddressText : {
        color: '#112C17',
        fontSize : 16, 
        fontWeight: 500,
        fontFamily: `EuclidCircularA-Medium`,
    },
    transactionLabel: {
        color: '#CFE8FF',
        fontSize : 16, 
        fontWeight: 500,
        fontFamily: `EuclidCircularA-Medium`,
    },
    transactionAmount: {
        color: '#FFFFFF',
        fontSize : 32, 
        fontWeight: 600,
        fontFamily: `EuclidCircularA-Medium`,
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
    // bottomDots: {
    //     position: 'absolute',
    //     width: '100%',
    //     // display: 'block',
    //     top: 0,
        
    //     // transform: 'translateY(-50%)',
    //     zIndex: 10
    // },
    // bottomDots: {
    //     top: '100%'
    // },
    // dotsSpan: {
    //     position: 'absolute',
    //     width: 6,
    //     height: 6,
    //     // display: 'block',
    //     borderRadius: '50',
    //     top: 0,
    //     // transform: 'translateY(-50%)',
    //     backgroundColor: 'blue'
    // }
    // .dots span:nth-child(1){
    //     width: 30px;
    //     height: 30px;
    //     left: -15px;
    // }
    // .dots span:nth-child(2){
    //     width: 30px;
    //     height: 30px;
    //     right: -15px;
    // }
    // .dots span:nth-child(3){
    //     left: 19px;
    // }
    // .dots span:nth-child(4){
    //     left: 29px;
    // }
    // .dots span:nth-child(5){
    //     left: 39px;
    // }
    // .dots span:nth-child(6){
    //     left: 49px;
    // }
    // .dots span:nth-child(7){
    //     left: 59px;
    // }
    // .dots span:nth-child(8){
    //     left: 69px;
    // }
    // .dots span:nth-child(9){
    //     left: 79px;
    // }
    // .dots span:nth-child(10){
    //     left: 89px;
    // }
});


export default TransactionReceipt;