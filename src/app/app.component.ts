import { Component, OnInit, NgZone } from '@angular/core';
import { IpcService } from './ipc.service';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public programsList;
  public selectedDayPrograms;
  public detailedProgramTabs;

  public chartData: SingleDataSet = [];
  public chartLabels: Label[] = [];
  public chartLegend = true;

  constructor(private readonly _ipc: IpcService, private readonly zone: NgZone) {}

  ngOnInit() {
    this._ipc.send('getHours');

    this._ipc.on('updatedHours', (e, data) => {
      this.zone.run(() => this.programsList = data);
    });
  }

  showChart(date) {
    this.resetChart();

    this.selectedDayPrograms = this.programsList
      .find(f => f.date == date)
      .list
      .map(e => {
        const time = e.subType.reduce((acc, obj) => {
          acc.time += obj.time;
          return acc;
        }).time.toFixed(2);

        this.chartLabels.push(e.name);
        this.chartData.push(time);

        return {
          name: e.name,
          time,
          subType: e.subType
      }});
  }

  showDetailProgramTabs(event) {
    if(event.active.length > 0) {
      const label = event.active[0]._chart.config.data.labels[event.active[0]._index];

      this.detailedProgramTabs = this.selectedDayPrograms
        .find(e => e.name === label).subType;
    }
  }

  resetChart() {
    this.chartLabels = [];
    this.chartData = [];
  }
}
