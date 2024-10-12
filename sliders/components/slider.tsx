// SliderExample.tsx
import React from 'react';
import { Slider } from '@miblanchard/react-native-slider';
import { StyleSheet, View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SliderExample extends React.Component {
    state = {
        red: 0,
        green: 0,
        blue: 0,
    };

    componentDidMount() {
        this.loadColors();
    }

    loadColors = async () => {
        try {
            const red = await AsyncStorage.getItem('red');
            const green = await AsyncStorage.getItem('green');
            const blue = await AsyncStorage.getItem('blue');

            this.setState({
                red: red !== null ? parseFloat(red) : 0,
                green: green !== null ? parseFloat(green) : 0,
                blue: blue !== null ? parseFloat(blue) : 0,
            });
        } catch (error) {
            console.error('Failed to load colors:', error);
        }
    };

    saveColors = async () => {
        const { red, green, blue } = this.state;
        try {
            await AsyncStorage.setItem('red', red.toString());
            await AsyncStorage.setItem('green', green.toString());
            await AsyncStorage.setItem('blue', blue.toString());
            console.log('Colors saved:', { red, green, blue });
        } catch (error) {
            console.error('Failed to save colors:', error);
        }
    };

    render() {
        const { red, green, blue } = this.state;

        // Convert RGB values to a string for background color
        const backgroundColor = `rgb(${red * 255}, ${green * 255}, ${blue * 255})`;

        return (
            <View style={[styles.container, { backgroundColor }]}>
                <Text style={styles.title}>Red</Text>
                <Slider
                    value={red}
                    onValueChange={(value) => this.setState({ red: value })}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                />

                <Text style={styles.title}>Green</Text>
                <Slider
                    value={green}
                    onValueChange={(value) => this.setState({ green: value })}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                />

                <Text style={styles.title}>Blue</Text>
                <Slider
                    value={blue}
                    onValueChange={(value) => this.setState({ blue: value })}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                />

                <Button title="Save Colors" onPress={this.saveColors} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'white',
    },
});

export default SliderExample;
