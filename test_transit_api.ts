import { TransitApiAggregator } from './backend/src/services/transit_api';

async function run() {
    console.log('--- Starting Transit API Aggregator Test ---');
    const api = new TransitApiAggregator();

    // Listen to events
    api.on('ELEVATOR_ALERT', (alert) => {
        console.log('\n[WS EVENT TRIGGERED] ELEVATOR_ALERT:', JSON.stringify(alert, null, 2));
    });

    api.on('TRANSIT_DELAY', (alert) => {
        console.log('\n[WS EVENT TRIGGERED] TRANSIT_DELAY:', JSON.stringify(alert, null, 2));
    });

    console.log('Fetching live data from STASY Elevators API (Line 1)...');
    try {
        const elevators = await api.fetchElevatorsStatus('1');
        if (elevators) {
            console.log('Successfully fetched elevator data. First station sample:');
            console.log(JSON.stringify(elevators[0], null, 2));
        } else {
            console.log('STASY API returned an error (likely 500). Could not fetch elevator data.');
        }

        console.log('\nFetching live vehicle data from OASA Telematics API (Line 140)...');
        await api.checkOasaDelays('140');
        console.log('Successfully fetched OASA data. If there are delays, they will trigger a TRANSIT_DELAY event.');

    } catch (e) {
        console.error('Error during test:', e);
    }
    console.log('\n--- Test Execution Complete ---');
}

run();
