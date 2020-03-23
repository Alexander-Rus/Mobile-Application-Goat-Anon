import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

//This is the post component, we are going to use it to format each post properly.
export default function Card(props) {
    return (
        <View style={styles.card}>
            <View style={styles.cardConent}>
                { props.children }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: { 
        borderRadius: 6,
        elevation: 3,
        backgroundColor: '#fff',
        shadowOffset: {width: 1, height: 1},
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginHorizontal: 4,
        marginVertical: 6

    },
    cardConent:{
        marginHorizontal: 18,
        marginVertical: 10,

    }
})