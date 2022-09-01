import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale } from 'chart.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'yag si demem';
  posts: any;
  form: FormGroup;
  charts: any;
  committerNames = [];
  repeatCounter = [];
  counter = 0;
  formDeger = [];
  committerMailsUnique = [];
  dateSince1 = "2000-01-01";//default start date
  dateUntil1 = "2033-01-01";//default end date
  formName=[];
  columns=["committer_email","numberOfCommits"];
  pageProjects : number =1;
  pageCommitters: number =1;
  mailHolder=[];
  mergeControl:boolean= false;
  committerTitles=[];
  projects= [];
  projects1:any;
  show:boolean=false;
  tokenControl:any;

  constructor(private http: HttpClient, private fb: FormBuilder) {

    Chart.register(BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale);

  }

  ngOnInit() {
    this.form = this.fb.group({
      id: this.fb.array([]),
      committer_name: this.fb.array([]),
      name: this.fb.array([]),
      committer_email: this.fb.array([]),
      id1: this.fb.array([])
    });
    
  }
  //when drawing charts it clears the necessary arrays.
  clear() {
    this.formDeger = new Array();
    this.formName.splice(0);
    this.mailHolder.splice(0); 
    this.committerTitles.splice(0);
  }

  //startDate
  dateSince(event:any){
    this.dateSince1 = event.target.value;
  }
  
  //endDate
  dateUntil(event:any){
    this.dateUntil1 = event.target.value;
  }

  //merge commit controller
  mergeSubmit(){
    this.mergeControl = !this.mergeControl;
  }

  //function that clears all arrays when a new token submitted.
  tokenEnter(token:any){
    this.committerMailsUnique.splice(0);
    this.projects.splice(0);
    this.formDeger = new Array();
    this.formName.splice(0);
    this.mailHolder.splice(0); 
    this.committerTitles.splice(0);
   fetch('https://yourNameSpace/api/v4/groups?private_token='+token)
  .then((response) => response.json())
  .then((data) => this.tokenPass(data, token));
  }

  //token and the data from fetch function gets processed
  tokenPass(data, token){
    if(data.message =="401 Unauthorized"){
      //invalid token
      this.show=false;
      this.clear();
    }else if(token=='') {
      //no token
      this.show=false;
      this.clear();
    }else{
      //token entered and valid
      this.clear();
      this.tokenControl= token;     
      this.show=true;
      this.http.get('https://yourNameSpace/api/v4/groups?private_token='+token+'&per_page=100').subscribe(data => this.posts = data);
    }
  }

  //project form pagination
  onProjectsPageChange(event: any){
    this.pageProjects = event;
  }

  //function that called when changing project groups
  async changedGroup(id3:any){
    //clearing committer, project arrays because it will be reused
    const selectedCommitter = (this.form.controls.committer_email as FormArray);
    const selectedProject = (this.form.controls.id as FormArray);
    const selectedProjectName = (this.form.controls.name as FormArray);
    
    selectedProjectName.clear();
    selectedCommitter.clear();
    selectedProject.clear();
    
    this.projects.splice(0);
    this.committerMailsUnique.splice(0);

    //assinging the new projects of a group to an array
    this.projects1 = await this.groupApiCall(id3).toPromise();
  
        this.projects1.forEach((project: any) => {
          
          this.projects.push(
            {
              "id": project.id,
              "name": project.name
            }
          );
        });
  }

  //api call that brings the projects of a group
  groupApiCall(deger){
    return this.http.get('https://yourNameSpace/api/v4/groups/'+ deger +'/projects?private_token='+this.tokenControl+'&per_page=100');
  }
  
  //function that adds or removes projects when the checkbox state is changed.
  async changedProject(id: any, name:any, isChecked: boolean) {

    this.committerMailsUnique.splice(0);
    
    const selectedCommitter = (this.form.controls.committer_email as FormArray);
    const selectedProject = (this.form.controls.id as FormArray);
    const selectedProjectName = (this.form.controls.name as FormArray);

    selectedCommitter.clear();
    if (isChecked) {

      selectedProject.push(new FormControl(id));

      selectedProjectName.push(new FormControl(name));

    } else {

      const index = selectedProject.controls.findIndex(x => x.value === id);
      selectedProject.removeAt(index);

      const index1 = selectedProjectName.controls.findIndex(y => y.value === name);
      selectedProjectName.removeAt(index1);

    }
    
    for (let j = 0; j < this.form.value.id.length; j++) {

      this.charts = await this.apiCall(this.form.value.id[j], this.dateSince1, this.dateUntil1).toPromise();

      this.charts.forEach((commit: any) => {
        
          if (this.committerMailsUnique.includes(commit.committer_email)) {

          } else if(commit.committer_email.includes("yourEmailExtension")){
            this.committerMailsUnique.push(commit.committer_email)
          }     

      });
    }
    
  }

  //Api call that brings the committers from the selected projects.
  apiCall(deger: string, since: string, until:string) {
    return this.http.get('https://yourNameSpace.com/api/v4/projects/' + deger + '/repository/commits?private_token='+this.tokenControl+'&per_page=100&since='+ since +'T00:00:00>&until='+ until +'T00:00:00Z');
  }

  //function that adds or removes committers when the checkbox status is changed.
  changedCommitter(committer_email: any, isChecked: boolean) {

    const selectedCommitter = (this.form.controls.committer_email as FormArray);

    if (isChecked) {
      selectedCommitter.push(new FormControl(committer_email));
    } else {
      const index = selectedCommitter.controls.findIndex(x => x.value === committer_email);
      selectedCommitter.removeAt(index);
    }

  }

  //works on form submit
  async onFormSubmit() {

    //declaration of an array to print canvas.
    for (let index in this.form.value.id) {
      this.formDeger.push(this.form.value.id[index]);
    }
    for(let index in this.form.value.committer_email){
      this.mailHolder.push(this.form.value.committer_email[index]);
    }

    for (let k=0;k<this.form.value.id.length;k++) {
      
      
      //it makes an api call for the given project id.
      this.charts =await this.apiCall(this.form.value.id[k], this.dateSince1, this.dateUntil1).toPromise();

      this.charts.forEach((commit:any) => {        
        //getting committer names and titles and pushing them to an array.
          if(commit.committer_email.includes("yourMailExtension")){          
            this.committerNames.push(commit.committer_email);
            this.committerTitles.push(commit.title);
          }
          else{
          }       
      });
      //for loop that checks every name and counts how many times it occured.
      for (let i in this.mailHolder) {
        this.counter = 0;
        for (let j in this.committerNames) {
          if ((this.mailHolder[i] == this.committerNames[j])&&(this.mergeControl==true)) {
            this.counter = this.counter + 1;
          } else if((this.mailHolder[i] == this.committerNames[j])&&(this.mergeControl==false)) {         
            if(this.committerTitles[j].includes("Merge branch")){
              
            }
            else{
              this.counter = this.counter + 1;
            }
          }
        }
        this.repeatCounter.push(this.counter);
      }

      //adding the name occurences to an array with the same order as names.
      for (let i = 0; i <this.mailHolder.length; i++) {
        this.formName.push(this.repeatCounter[i]);       
      } 

      //calling the draw chart.
      this.drawChart(this.mailHolder, this.repeatCounter, this.form.value.id[k], this.form.value.name[k]);
        
      //clearing arrays for the next project
      this.committerNames.splice(0);
      this.repeatCounter.splice(0);
      this.committerTitles.splice(0);
    }
  }

  //printing the table data for the given project.
  setTableData(index1, index2){
    if(index1==0){
      return this.formName[index2];
    }else{
      return this.formName[((this.form.value.committer_email.length)*index1)+index2];
    }
      
  }

  //splitting mails from @
  mailSplitter(data:any){
    return data.split('@')[0];
  }

  //drawing chart
  drawChart(label: any, data: any, id: any, name: any) {   

    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const ctx = canvas.getContext('2d');

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: label,
        datasets: [{
          label: name,
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}