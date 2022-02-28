# Elevator of my dream

This repo contains logic and demo UI for a basic Elevator moving logic.

Here are steps and general notes about how it works.

There are 3 main modules:
- Elevator Machine - imitates a physical implementation of the Elevator shaft, cabin, motor, doors etc.
- Elevator Controller - simulates logic to detect the closest floor with passengers, commands Elevator Machine to perform actions, like start moving, stop moving and handling events from it.
- UI - web interface visualizing the logic and the process of the Elevator work.

**In the beginning the cabin is not moving. The floors are empty (no passengers).**

Process, when the floors are not empty and the elevator is started:
1. Detect the closest floor with the passengers amount more than 0.
2. Move to the cabin to the non-empty floor. 
3. Compare amount of passengers going up vs going down to define the next step direction. If the amounts are equal, the default priority direction is Up.
4. Move in the direction defined in step 3.
5. Stop and open doors.
6. Unload passengers with the destination floor equal to the current cabin floor.
7. Load passengers going in the same direction as those that are already in the cabin.
8. Detect floor to stop by comparing destination floor of the passengers in the cabin to the floor coming.
9. 