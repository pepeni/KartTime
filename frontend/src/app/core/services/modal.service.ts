import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NewTournamentDialogComponent } from "../../../shared/components/new-tournament-dialog/new-tournament-dialog.component";
import { JoinTournamentDialogComponent } from "../../../shared/components/join-tournament-dialog/join-tournament-dialog.component";
import { AddNewResultGpDialogComponent } from "../../../shared/components/add-new-result-gp-dialog/add-new-result-gp-dialog.component";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ModalService {

    constructor(private readonly _dialog: MatDialog) { }

    public openNewGPDialog(): void {
        this._dialog.open(NewTournamentDialogComponent, {width: '364px', height: '600px'});
    }

    public openJoinGPDialog(): void {
        this._dialog.open(JoinTournamentDialogComponent, {width: '364px', height: '332px'});
    }

    public openAddNewResultGpDialog(gpId: number): Observable<boolean>{
        const dialogRef = this._dialog.open(AddNewResultGpDialogComponent, {width: '364px', height: '364px', data: { gpId }});
        return dialogRef.afterClosed();
    }
}
