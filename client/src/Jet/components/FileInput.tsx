import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import Button from './Button';
import Divider from './Divider';
import Box from './Box';
import { Icon } from '../icons';
import { IconEnum } from '../icons/Icons';
import Tooltip from './Tooltip';


export interface FileInputProps extends React.HTMLAttributes<HTMLDivElement> {
	files?: File[];
	accept?: string;
	multiple?: boolean;
	maxFiles?: number;
	maxSize?: number;
	fileListStyle?: React.CSSProperties;
	onChanged?: (files: File[]) => void;
	tooltipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'none';
}

const FileInputContainerStyle = styled.div`
	display: inline-block;
	width: 100%;
	margin: 0.4rem 0;
`;

const FileInputStyle = styled.div.attrs((props: any) => props)`
	padding: 0.4rem 0.8rem;
	background-color: ${theme.colors.background[2]};
	border-radius: ${theme.rounded};
	position: relative;
`;
	
const HelperTextStyle = styled.small`
	word-break: break-word;
`;

const FileListStyle = styled.div`
	overflow-y: auto;
`;

const FileStyle = styled.div.attrs((props: any) => props)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 0.4rem;
	padding: 0.4rem 0.8rem;
	color: ${props => props.invalid ? theme.colors.danger[0] : theme.colors.text[0]};
	background-color: ${theme.colors.background[3]};
	border-radius: ${theme.rounded};
	overflow-y: auto;
	opacity: ${props => props.excluded ? 0.4 : 1};
`;

const DeleteIconStyle = styled(Icon)`
	cursor: pointer;
`;

/**
 * Use onChanged for onChange event
 */
const FileInput = (props: FileInputProps) => {
	const { files = [], accept, multiple, maxFiles = -1, maxSize = 10000000, fileListStyle, onChanged, tooltipPosition = 'bottom', ...rest } = props;
	const [inputRef, setInputRef] = React.useState<HTMLInputElement | null>(null);


	const getSizeString = (bytes: number) => {
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		if (bytes === 0) return '0 B';
		const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
		return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
	}

	const handleUpdate = (addedFiles: File[]) => {
		if (files.length > 0 && multiple) {
			const newArr = [...files];
			
			Array.from(addedFiles).forEach(file => {
				if (!newArr.some(f => f.name === file.name)) newArr.push(file);
			});

			onChanged && onChanged(newArr);
		} else
			onChanged && onChanged(addedFiles);
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		handleUpdate(Array.from(e.dataTransfer.files));
	}

	return (
		<FileInputContainerStyle {...rest} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
			<FileInputStyle theme={theme}>
				<input
					type="file"
					accept={accept}
					multiple={multiple}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate(Array.from(e.target.files || []))}
					ref={setInputRef}
					style={{ display: 'none' }}
				/>
				
				<Box justifyContent="space-between" alignItems="center">
					<Button color="primary" variant="outlined" onClick={() => inputRef && inputRef.click()}>
						{`${files.length > 0 && multiple ? 'Add' : 'Choose'} File${multiple ? 's' : ''}`}
					</Button>
					{files.length > 0 && <Box style={{ color: files.length > maxFiles && maxFiles !== -1 ? theme.colors.danger[0] : 'inherit' }}>{files.length}{maxFiles !== -1 && `/${maxFiles}`} file{files.length > 1 ? 's' : ''} selected</Box>}
					{files.length === 0 && tooltipPosition !== 'none' && (
						<Tooltip position={tooltipPosition} icon={{ icon: IconEnum.upload }} onClick={() => inputRef && inputRef.click()}>
							<span>Drag and drop a file here to upload</span>
						</Tooltip>
					)}
				</Box>
				{files.length > 0 && <Divider />}

				<FileListStyle style={fileListStyle}>
					{files && files.length > 0 && files.map((file, index) => (
						<FileStyle theme={theme} key={index} excluded={maxFiles !== -1 && (index + 1) > maxFiles}>
								<Box alignItems="center">
									<Icon icon={IconEnum.file} style={{ marginRight: '0.4rem' }} />
									<Box flexDirection="column">
										{file.name}
										<small style={{ color: file.size > maxSize ? theme.colors.danger[0] : 'inherit' }}>{getSizeString(file.size)}</small>
									</Box>
								</Box>
							<DeleteIconStyle icon={IconEnum.x} size={24} onClick={() => {
								const newFiles = files.filter((f, i) => i !== index);
								onChanged && onChanged(newFiles);
							}} />
						</FileStyle>
					))}
				</FileListStyle>
			</FileInputStyle>

			<Box justifyContent="space-between" style={{ marginTop: '0.2rem' }}>
				{accept && <HelperTextStyle>Accepted files: {accept.split(',').join(', ')}</HelperTextStyle>}
				{maxSize !== 10000000 && <HelperTextStyle>Max size: {getSizeString(maxSize)}</HelperTextStyle>}
			</Box>
		</FileInputContainerStyle>
	);
}

export default FileInput;
