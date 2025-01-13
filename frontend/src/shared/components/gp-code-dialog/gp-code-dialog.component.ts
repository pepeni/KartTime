import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-gp-code-dialog",
	standalone: true,
	imports: [MatIconModule, MatButtonModule, CommonModule],
	templateUrl: "./gp-code-dialog.component.html",
	styleUrl: "./gp-code-dialog.component.scss",
})
export class GpCodeDialogComponent {
	copied = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { gpCode: string },
		private dialogRef: MatDialogRef<GpCodeDialogComponent>
	) {}

	copyCode(): void {
		navigator.clipboard.writeText(this.data.gpCode);
		this.copied = true; 
	  }

	close(): void {
		this.dialogRef.close();
	}
}
