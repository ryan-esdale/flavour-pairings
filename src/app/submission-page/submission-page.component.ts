import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenerateRibbonDataService } from '../services/generate-ribbon-data.service';
import { Flavour } from '../services/_interfaces';
import { UploadDataService } from '../services/upload-data.service';

@Component({
  selector: 'app-submission-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './submission-page.component.html',
  styleUrl: './submission-page.component.css'
})
export class SubmissionPageComponent {

  public flavourList: Flavour[] = []

  public newFlavourName: string = ''
  public newFlavourResponse: string = ''

  public newPairingPrimary: number = 0
  public newPairingSecondary: number = 0
  public newPairingComments: string = ''
  public newPairingResponse: string = ''


  constructor(private service: GenerateRibbonDataService, private upload: UploadDataService) { }


  ngOnInit(): void {

    this.service.loadHeaders().subscribe(
      (vals) => {
        this.flavourList = vals
      }
    )

  }

  uploadFlavour() {
    if (this.newFlavourName != '')
      this.upload.uploadFlavour(this.newFlavourName).subscribe((res) => this.newFlavourResponse = res)
  }

  uploadPairing() {
    if (this.newPairingPrimary != this.newPairingSecondary)
      this.upload.uploadPairing(this.newPairingPrimary, this.newPairingSecondary, this.newPairingComments).subscribe((res) => this.newPairingResponse = res)
  }
}
