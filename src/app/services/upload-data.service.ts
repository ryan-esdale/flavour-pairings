import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadDataService {

  constructor(private http: HttpClient) { }

  uploadFlavour(flavourName: string): Observable<any> {
    console.log(flavourName)
    return this.http.post<any>(`https://xez3vj4rs1.execute-api.eu-west-2.amazonaws.com/Test/flavours?flavour_name=${flavourName}`,
      {
        flavour_name: flavourName,
      }
    )
  }


  uploadPairing(primary_flavour_id: number, secondary_flavour_id: number, comments?: string): Observable<any> {
    console.log(primary_flavour_id)
    console.log(secondary_flavour_id)
    console.log(comments)
    return this.http.post<any>(`https://xez3vj4rs1.execute-api.eu-west-2.amazonaws.com/Test/pairings?primary_flavour_id=${primary_flavour_id}&secondary_flavour_id=${secondary_flavour_id}&comments=${comments}`,
      {
        primary_flavour_id: primary_flavour_id,
        secondary_flavour_id: secondary_flavour_id,
        comments: comments
      }
    )
  }
}
