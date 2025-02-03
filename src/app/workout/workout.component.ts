import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-workout',
  standalone: false,
  
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css'
})
export class WorkoutComponent {
  workoutForm: FormGroup;
  workoutTypes: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting'];
  workouts: any[] = [];
  filteredWorkouts: any[] = [];
  displayedColumns: string[] = ['userName', 'workoutType', 'workoutMinutes'];
  totalMinutes: number = 0;

  workoutChartLabels: string[] = [];
  workoutChartData: number[] = [];
  workoutChartConfig: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: this.workoutChartLabels,
      datasets: [
        {
          label: 'Workout Minutes',
          data: this.workoutChartData,
          borderColor: '#3f51b5',
          backgroundColor: '#3f51b5',
          pointBackgroundColor: '#e91e63',
          pointBorderColor: '#ff9800',
          pointRadius: 5,
          fill: false,
          tension: 0.4, // Smooth line
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Workout Type'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Minutes'
          },
          beginAtZero: true
        }
      }
    }
  };

  constructor(private fb: FormBuilder) {
    this.workoutForm = this.fb.group({
      userName: ['', Validators.required],
      workoutType: [[], Validators.required],
      workoutMinutes: [0, [Validators.required, Validators.min(1)]]
    });
  }

  submitWorkout() {
    if (this.workoutForm.valid) {
      const workout = this.workoutForm.value;
      this.workouts.push(workout);
      this.filteredWorkouts = [...this.workouts];
      this.calculateTotalMinutes();
      this.updateChart();
      this.workoutForm.reset(); // Reset form after submission
    }
  }

  applyFilter(searchTerm: string) {
    if (!searchTerm) {
      this.filteredWorkouts = [...this.workouts];
    } else {
      this.filteredWorkouts = this.workouts.filter(workout =>
        workout.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.updateChart();
  }

  filterByType(selectedType: string) {
    if (selectedType === 'All') {
      this.filteredWorkouts = [...this.workouts];
    } else {
      this.filteredWorkouts = this.workouts.filter(workout =>
        workout.workoutType.includes(selectedType)
      );
    }
    this.updateChart();
  }

  calculateTotalMinutes() {
    this.totalMinutes = this.workouts.reduce((sum, workout) => sum + workout.workoutMinutes, 0);
  }

  updateChart() {
    const workoutDataMap = new Map<string, number>();

    this.filteredWorkouts.forEach(workout => {
      workout.workoutType.forEach((type: string) => {
        workoutDataMap.set(type, (workoutDataMap.get(type) || 0) + workout.workoutMinutes);
      });
    });

    this.workoutChartLabels = Array.from(workoutDataMap.keys());
    this.workoutChartData = Array.from(workoutDataMap.values());

    // Update chart dataset
    this.workoutChartConfig.data.labels = this.workoutChartLabels;
    this.workoutChartConfig.data.datasets[0].data = this.workoutChartData;
  }
}
